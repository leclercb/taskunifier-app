import uuid from 'uuid';
import moment from 'moment';
import { _loadData, _saveData } from './AppActions';
import { updateProcess } from './ProcessActions';
import { createDirectory, getUserDataPath, join, deleteDirectory } from '../utils/ActionUtils';
import { getBackups } from '../utils/BackupUtils';

export const restoreBackup = backupId => {
    createDirectory(join(getUserDataPath(), 'backups'));
    return _loadData(join(getUserDataPath(), 'backups', backupId));
};

export const backupData = () => {
    createDirectory(join(getUserDataPath(), 'backups'));

    return (dispatch, getState) => {
        return new Promise(resolve => {
            const promise = dispatch(_saveData(join(getUserDataPath(), 'backups', '' + Date.now().valueOf()), { message: 'Backup database' }));

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
                deleteDirectory(join(getUserDataPath(), 'backups', '' + date));

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

            const backups = getBackups().sort((a, b) => Number(a) - Number(b));

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