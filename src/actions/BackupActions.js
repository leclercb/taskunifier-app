import uuid from 'uuid';
import moment from 'moment';
import { _loadData, _saveData } from 'actions/AppActions';
import { updateProcess } from 'actions/ProcessActions';
import { getSettings } from 'selectors/SettingSelectors';
import { deleteDirectory, join } from 'utils/ActionUtils';
import { getBackups } from 'utils/BackupUtils';

export function restoreBackup(backupId) {
    return (dispatch, getState) => {
        const path = join(getState().settings.dataFolder, 'backups', backupId);
        return dispatch(_loadData(path));
    };
}

export function backupData() {
    return (dispatch, getState) => {
        return new Promise(resolve => {
            const path = join(getState().settings.dataFolder, 'backups', '' + Date.now().valueOf());
            const promise = dispatch(_saveData(path, { clean: false, message: 'Backup database' }));

            promise.then(() => {
                dispatch(cleanBackups());
                resolve();
            });
        });
    };
}

export function deleteBackup(date) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const processId = uuid();

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: `Delete backup "${moment(Number(date)).format('DD-MM-YYYY HH:mm:ss')}"`
            }));

            try {
                const path = join(getSettings(state).dataFolder, 'backups', '' + date);
                deleteDirectory(path, getSettings(state).dataFolder);

                dispatch(updateProcess({
                    id: processId,
                    state: 'COMPLETED'
                }));

                resolve();
            } catch (err) {
                dispatch(updateProcess({
                    id: processId,
                    state: 'ERROR',
                    error: err.toString()
                }));

                reject();
            }
        });
    };
}

export function cleanBackups() {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const processId = uuid();
            const maxBackups = getSettings(state).maxBackups;

            if (!maxBackups) {
                reject();
                return;
            }

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Clean backups',
                notify: true
            }));

            const backups = getBackups(state);
            const promises = [];

            for (let index = 0; index < backups.length - maxBackups; index++) {
                promises.push(dispatch(deleteBackup(backups[index])));
            }

            Promise.all(promises).then(() => {
                dispatch(updateProcess({
                    id: processId,
                    state: 'COMPLETED'
                }));

                resolve();
            }).catch(() => {
                dispatch(updateProcess({
                    id: processId,
                    state: 'ERROR'
                }));

                reject();
            });
        });
    };
}