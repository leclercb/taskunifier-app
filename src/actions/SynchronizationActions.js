import moment from 'moment';
import uuid from 'uuid';
import { updateSettings } from 'actions/SettingActions';
import { updateProcess } from 'actions/ThreadActions';
import { refreshToken } from 'actions/toodledo/Authorization';
import { addRemoteFolder, deleteRemoteFolder, getRemoteFolders, editRemoteFolder } from 'actions/toodledo/Folders';
import { getFolders } from 'selectors/FolderSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoData } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';

export function updateToodledoData(data) {
    return async dispatch => {
        dispatch({
            type: 'UPDATE_TOODLEDO_DATA',
            data
        });
    };
}

export function synchronize() {
    return async (dispatch, getState) => {
        const processId = uuid();

        try {
            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Synchronize with Toodledo',
                notify: true
            }));

            const state = getState();
            const settings = getSettings(state);

            if (settings.toodledo && settings.toodledo.accessToken && settings.toodledo.refreshToken) {
                const accessTokenCreationDate = moment(settings.toodledo.accessTokenCreationDate);
                const expirationDate = accessTokenCreationDate.add(settings.toodledo.accessTokenExpiresIn, 'seconds');

                if (moment().diff(expirationDate) > 0) {
                    await dispatch(refreshToken());
                }
            } else {
                throw new Error('You are not connected to Toodledo');
            }

            await dispatch(synchronizeFolders());

            await dispatch(updateSettings({
                lastSynchronizationDate: moment().toISOString()
            }));

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data);
            }

            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

function synchronizeFolders() {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);
        const folders = getFolders(state);

        const addPromises = filterByVisibleState(folders)
            .filter(folder => !folder.refIds.toodledo)
            .map(folder => dispatch(addRemoteFolder(folder)));

        await Promise.all(addPromises);

        const deletePromises = folders
            .filter(folder => !!folder.refIds.toodledo && folder.state === 'TO_DELETE')
            .map(folder => dispatch(deleteRemoteFolder(folder)));

        await Promise.all(deletePromises);

        const lastEditFolder = moment(getToodledoData(state).lastedit_folder);

        if (!settings.lastSynchronizationDate ||
            moment(lastEditFolder).diff(moment(settings.lastSynchronizationDate)) > 0) {
            const remoteFolders = await dispatch(getRemoteFolders());

            // TODO merge remote folders into local folders
        }

        const updatePromises = folders
            .filter(folder => !!folder.refIds.toodledo && folder.state === 'TO_UPDATE')
            .map(folder => dispatch(editRemoteFolder(folder)));

        await Promise.all(updatePromises);
    };
}