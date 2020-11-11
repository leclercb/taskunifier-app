import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { deletePath, getDataFolder, readDirectory } from 'actions/ActionUtils';
import { _loadDataFromFile, _saveDataToFile } from 'actions/AppActions';
import { updateSettings } from 'actions/SettingActions';
import { updateProcess } from 'actions/ThreadActions';
import { getSettings } from 'selectors/SettingSelectors';
import { exists, joinSync } from 'utils/ElectronIpc';

export async function getBackupIds(settings) {
    const dataFolder = await getDataFolder(settings);
    const path = joinSync(dataFolder, 'backups');

    let items = await readDirectory(path);
    items = items.map(item => item.replace('.zip', ''));
    items = items.filter(item => moment(item, moment.ISO_8601, true).isValid());

    return items.sort((a, b) => moment(a).diff(moment(b)));
}

export function restoreBackup(backupId) {
    return async (dispatch, getState) => {
        const dataFolder = await getDataFolder(getState().settings);
        let path = joinSync(dataFolder, 'backups');

        let zip;

        try {
            await exists(joinSync(path, backupId + '.zip'));
            path = joinSync(path, backupId + '.zip');
            zip = true;
        } catch (e) {
            path = joinSync(path, backupId);
            zip = false;
        }

        return dispatch(_loadDataFromFile(path, { skipSettings: true, zip }));
    };
}

export function backupData() {
    return async (dispatch, getState) => {
        const dataFolder = await getDataFolder(getState().settings);
        const path = joinSync(dataFolder, 'backups', moment.utc().format('YYYYMMDD[T]HHmmss[Z]') + '.zip');
        await dispatch(_saveDataToFile(path, { clean: false, message: 'Backup database', zip: true }));
        await dispatch(cleanBackups());

        await dispatch(updateSettings({
            lastBackupDate: moment().toISOString()
        }));
    };
}

export function deleteBackup(backupId) {
    return async (dispatch, getState) => {
        const state = getState();
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Delete backup "${moment(backupId).format('DD-MM-YYYY HH:mm:ss')}"`
        }));

        try {
            const dataFolder = await getDataFolder(getSettings(state));
            const path = joinSync(dataFolder, 'backups');

            try {
                await exists(joinSync(path, backupId + '.zip'));
                await deletePath(joinSync(path, backupId + '.zip'), dataFolder);
            } catch (e) {
                await deletePath(joinSync(path, backupId), dataFolder);
            }

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
            const backupIds = await getBackupIds(getSettings(state));
            const promises = [];

            for (let index = 0; index < backupIds.length - maxBackups; index++) {
                promises.push(dispatch(deleteBackup(backupIds[index])));
            }

            await Promise.all(promises);

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