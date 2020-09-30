import moment from 'moment';
import { addFolder, deleteFolder, updateFolder } from 'actions/FolderActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getFolders } from 'selectors/FolderSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeFolders() {
    return async (dispatch, getState) => {
        let folders = getFolders(getState());

        {
            const foldersToAdd = filterByVisibleState(folders).filter(folder => !folder.refIds.taskunifier);
            const foldersToAddPromises = foldersToAdd.map(folder => dispatch(addRemoteFolder(folder)));
            const result = await Promise.all(foldersToAddPromises);

            await dispatch(updateFolder(result, { loaded: true, skipUpdateMiddleware: true }));
        }

        folders = getFolders(getState());

        {
            const foldersToDelete = folders.filter(folder => !!folder.refIds.taskunifier && folder.state === 'TO_DELETE');
            const foldersToDeletePromises = foldersToDelete.map(folder => dispatch(deleteRemoteFolder(folder)));
            await Promise.all(foldersToDeletePromises);

            await dispatch(deleteFolder(foldersToDelete.map(folder => folder.id)));
        }

        folders = getFolders(getState());

        const foldersToAdd = [];
        const foldersToUpdate = [];
        const foldersToDelete = [];
        const remoteFolders = await dispatch(getRemoteFolders());

        for (let remoteFolder of remoteFolders) {
            const localFolder = folders.find(folder => folder.refIds.taskunifier === remoteFolder.refIds.taskunifier);

            if (!localFolder) {
                foldersToAdd.push(remoteFolder);
            } else {
                if (moment(remoteFolder.updateDate).diff(moment(localFolder.updateDate)) > 0) {
                    foldersToUpdate.push(merge(localFolder, remoteFolder));
                }
            }
        }

        await dispatch(addFolder(foldersToAdd, { keepRefIds: true }));
        await dispatch(updateFolder(foldersToUpdate, { loaded: true, skipUpdateMiddleware: true }));

        folders = getFolders(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localFolder of filterByVisibleState(folders)) {
            if (!remoteFolders.find(folder => folder.refIds.taskunifier === localFolder.refIds.taskunifier)) {
                foldersToDelete.push(localFolder);
            }
        }

        await dispatch(deleteFolder(foldersToDelete.map(folder => folder.id), { force: true }));

        folders = getFolders(getState());

        {
            const foldersToUpdate = folders.filter(folder => !!folder.refIds.taskunifier && folder.state === 'TO_UPDATE');
            const foldersToUpdatePromises = foldersToUpdate.map(folder => dispatch(editRemoteFolder(folder)));
            await Promise.all(foldersToUpdatePromises);

            await dispatch(updateFolder(foldersToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteFolders(updatedAfter) {
    logger.debug('Get remote folders');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/folders`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(folder => convertFolderToLocal(folder));
    };
}

export function addRemoteFolder(folder) {
    logger.debug('Add remote folder', folder.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/folders`,
                data: convertFolderToRemote(folder)
            },
            settings);

        return {
            ...folder,
            refIds: {
                ...folder.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteFolder(folder) {
    logger.debug('Edit remote folder', folder.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/folders/${folder.refIds.taskunifier}`,
                data: convertFolderToRemote(folder)
            },
            settings);
    };
}

export function deleteRemoteFolder(folder) {
    logger.debug('Delete remote folder', folder.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        try {
            await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'DELETE',
                    url: `${getConfig().apiUrl}/v1/folders/${folder.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            logger.debug('Delete remote folder error', error);
        }
    };
}

function convertFolderToRemote(folder) {
    const remoteFolder = { ...folder };

    delete remoteFolder.id;
    delete remoteFolder.refIds;
    delete remoteFolder.state;
    delete remoteFolder.creationDate;
    delete remoteFolder.updateDate;

    return remoteFolder;
}

function convertFolderToLocal(folder) {
    const localFolder = {
        ...folder,
        refIds: {
            taskunifier: folder.id
        }
    };

    delete localFolder.id;
    delete localFolder.owner;

    return localFolder;
}