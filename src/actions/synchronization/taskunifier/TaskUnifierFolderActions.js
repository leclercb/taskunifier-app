import moment from 'moment';
import { addFolder, deleteFolder, updateFolder } from 'actions/FolderActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getFolders } from 'selectors/FolderSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeFolders() {
    return async (dispatch, getState) => {
        let folders = getFolders(getState());

        {
            const foldersToAdd = filterByVisibleState(folders).filter(folder => !folder.refIds.taskunifier);
            const foldersToAddPromises = foldersToAdd.map(folder => dispatch(addRemoteFolder(folder)));
            const result = await Promise.all(foldersToAddPromises);

            for (let folder of result) {
                await dispatch(updateFolder(folder, { loaded: true }));
            }
        }

        folders = getFolders(getState());

        {
            const foldersToDelete = folders.filter(folder => !!folder.refIds.taskunifier && folder.state === 'TO_DELETE');
            const foldersToDeletePromises = foldersToDelete.map(folder => dispatch(deleteRemoteFolder(folder)));
            await Promise.all(foldersToDeletePromises);

            for (let folder of foldersToDelete) {
                await dispatch(deleteFolder(folder.id));
            }
        }

        folders = getFolders(getState());

        const remoteFolders = await dispatch(getRemoteFolders());

        for (let remoteFolder of remoteFolders) {
            const localFolder = folders.find(folder => folder.refIds.taskunifier === remoteFolder.refIds.taskunifier);

            if (!localFolder) {
                await dispatch(addFolder(remoteFolder, { keepRefIds: true }));
            } else {
                if (moment(remoteFolder.updateDate).diff(moment(localFolder.updateDate)) > 0) {
                    await dispatch(updateFolder(merge(localFolder, remoteFolder), { loaded: true }));
                }
            }
        }

        folders = getFolders(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localFolder of filterByVisibleState(folders)) {
            if (!remoteFolders.find(folder => folder.refIds.taskunifier === localFolder.refIds.taskunifier)) {
                await dispatch(deleteFolder(localFolder.id, { force: true }));
            }
        }

        folders = getFolders(getState());

        {
            const foldersToUpdate = folders.filter(folder => !!folder.refIds.taskunifier && folder.state === 'TO_UPDATE');
            const foldersToUpdatePromises = foldersToUpdate.map(folder => dispatch(editRemoteFolder(folder)));
            await Promise.all(foldersToUpdatePromises);

            for (let folder of foldersToUpdate) {
                await dispatch(updateFolder(folder, { loaded: true }));
            }
        }
    };
}

export function getRemoteFolders(updatedAfter) {
    console.debug('getRemoteFolders');

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
    console.debug('addRemoteFolder', folder);

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
    console.debug('editRemoteFolder', folder);

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
    console.debug('deleteRemoteFolder', folder);

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
            console.debug(error);
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