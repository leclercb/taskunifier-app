import uuid from 'uuid';
import moment from 'moment';
import { getDirectories, getPathSeparator, deleteDirectory, join } from 'actions/ActionUtils';
import { _loadData, _saveData } from 'actions/AppActions';
import { updateProcess } from 'actions/ThreadActions';
import { getSettings } from 'selectors/SettingSelectors';

export function getBackupDate(directory) {
    return Number(directory.substr(directory.lastIndexOf(getPathSeparator()) + 1));
}

export function getBackups(settings) {
    const path = join(settings.dataFolder, 'backups');
    const backups = getDirectories(path).map(directory => getBackupDate(directory));
    return backups.sort((a, b) => Number(a) - Number(b));
}

export function restoreBackup(backupId) {
    return (dispatch, getState) => {
        const path = join(getState().settings.dataFolder, 'backups', backupId);
        return dispatch(_loadData(path, { skipSettings: true }));
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
            const { maxBackups } = getSettings(state);

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

            const backups = getBackups(getSettings(state));
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