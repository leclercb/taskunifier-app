import uuid from 'uuid/v4';
import moment from 'moment';
import { deleteDirectory, getDirectories, getPathSeparator } from 'actions/ActionUtils';
import { _loadDataFromFile, _saveDataToFile } from 'actions/AppActions';
import { updateProcess } from 'actions/ThreadActions';
import { getSettings } from 'selectors/SettingSelectors';
import { join } from 'utils/ElectronUtils';

export function getBackupId(directory) {
    return directory.substr(directory.lastIndexOf(getPathSeparator()) + 1);
}

export async function getBackups(settings) {
    const path = join(settings.dataFolder, 'backups');
    const directories = await getDirectories(path);
    const backups = directories.map(directory => getBackupId(directory));
    return backups.sort((a, b) => moment(a).diff(moment(b)));
}

export function restoreBackup(backupId) {
    return (dispatch, getState) => {
        const path = join(getState().settings.dataFolder, 'backups', backupId);
        return dispatch(_loadDataFromFile(path, { skipSettings: true }));
    };
}

export function backupData() {
    return async (dispatch, getState) => {
        const path = join(getState().settings.dataFolder, 'backups', moment().toISOString());
        await dispatch(_saveDataToFile(path, { clean: false, message: 'Backup database' }));
        await dispatch(cleanBackups());
    };
}

export function deleteBackup(date) {
    return async (dispatch, getState) => {
        const state = getState();
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Delete backup "${moment(Number(date)).format('DD-MM-YYYY HH:mm:ss')}"`
        }));

        try {
            const path = join(getSettings(state).dataFolder, 'backups', '' + date);
            await deleteDirectory(path, getSettings(state).dataFolder);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function cleanBackups() {
    return async (dispatch, getState) => {
        const state = getState();
        const processId = uuid();
        const { maxBackups } = getSettings(state);

        if (!maxBackups) {
            throw Error('Max number of backups is not set');
        }

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: 'Clean backups',
            notify: true
        }));

        try {
            const backups = await getBackups(getSettings(state));
            const promises = [];

            for (let index = 0; index < backups.length - maxBackups; index++) {
                promises.push(dispatch(deleteBackup(backups[index])));
            }

            await Promise.all(promises);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR'
            }));

            throw error;
        }
    };
}