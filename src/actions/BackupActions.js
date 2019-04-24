import uuid from 'uuid';
import moment from 'moment';
import { _loadData, _saveData } from 'actions/AppActions';
import { updateProcess } from 'actions/ProcessActions';
import { join, deleteDirectory } from 'utils/ActionUtils';
import { getBackups } from 'utils/BackupUtils';

export const restoreBackup = backupId => {
    return (dispatch, getState) => {
        const path = join(getState().settings.dataFolder, 'backups', backupId);
        return dispatch(_loadData(path));
    };
};

export const backupData = () => {
    return (dispatch, getState) => {
        return new Promise(resolve => {
            const path = join(getState().settings.dataFolder, 'backups', '' + Date.now().valueOf());
            const promise = dispatch(_saveData(path, { message: 'Backup database' }));

            promise.then(() => {
                dispatch(cleanBackups());
                resolve();
            });
        });
    };
};

export const deleteBackup = date => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: `Delete backup "${moment(Number(date)).format('DD-MM-YYYY HH:mm:ss')}"`
            }));

            try {
                const path = join(getState().settings.dataFolder, 'backups', '' + date);
                deleteDirectory(path, getState().settings.dataFolder);

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
};

export const cleanBackups = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const processId = uuid();
            const maxBackups = getState().settings.maxBackups;

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

            const backups = getBackups(getState).sort((a, b) => Number(a) - Number(b));

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
};