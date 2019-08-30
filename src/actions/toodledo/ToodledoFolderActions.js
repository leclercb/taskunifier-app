import moment from 'moment';
import { addFolder, deleteFolder, updateFolder } from 'actions/FolderActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/toodledo/ExceptionHandler';
import { getFolders } from 'selectors/FolderSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeFolders() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let folders = getFolders(getState());

        {
            const foldersToAdd = filterByVisibleState(folders).filter(folder => !folder.refIds.toodledo);
            const foldersToAddPromises = foldersToAdd.map(folder => dispatch(addRemoteFolder(folder)));
            const result = await Promise.all(foldersToAddPromises);

            for (let folder of result) {
                await dispatch(updateFolder(folder, { loaded: true }));
            }
        }

        folders = getFolders(getState());

        {
            const foldersToDelete = folders.filter(folder => !!folder.refIds.toodledo && folder.state === 'TO_DELETE');
            const foldersToDeletePromises = foldersToDelete.map(folder => dispatch(deleteRemoteFolder(folder)));
            await Promise.all(foldersToDeletePromises);

            for (let folder of foldersToDelete) {
                await dispatch(deleteFolder(folder.id));
            }
        }

        folders = getFolders(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditFolder = moment.unix(getToodledoAccountInfo(getState()).lastedit_folder);

            if (!lastSync || lastEditFolder.diff(lastSync) > 0) {
                const remoteFolders = await dispatch(getRemoteFolders());

                for (let remoteFolder of remoteFolders) {
                    const localFolder = folders.find(folder => folder.refIds.toodledo === remoteFolder.refIds.toodledo);

                    if (!localFolder) {
                        await dispatch(addFolder(remoteFolder, { keepRefIds: true }));
                    } else {
                        await dispatch(updateFolder(merge(localFolder, remoteFolder), { loaded: true }));
                    }
                }

                folders = getFolders(getState());

                for (let localFolder of filterByVisibleState(folders)) {
                    if (!remoteFolders.find(folder => folder.refIds.toodledo === localFolder.refIds.toodledo)) {
                        await dispatch(deleteFolder(localFolder.id, { force: true }));
                    }
                }
            }
        }

        folders = getFolders(getState());

        {
            const foldersToUpdate = folders.filter(folder => !!folder.refIds.toodledo && folder.state === 'TO_UPDATE');
            const foldersToUpdatePromises = foldersToUpdate.map(folder => dispatch(editRemoteFolder(folder)));
            await Promise.all(foldersToUpdatePromises);

            for (let folder of foldersToUpdate) {
                await dispatch(updateFolder(folder, { loaded: true }));
            }
        }
    };
}

export function getRemoteFolders() {
    console.debug('getRemoteFolders');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                method: 'GET',
                url: 'https://api.toodledo.com/3/folders/get.php',
                params: {
                    access_token: settings.toodledo.accessToken
                }
            },
            settings);

        checkResult(result);

        return result.data.map(folder => convertFolderToTaskUnifier(folder));
    };
}

export function addRemoteFolder(folder) {
    console.debug('addRemoteFolder', folder);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/folders/add.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    ...convertFolderToToodledo(folder)
                }
            },
            settings);

        checkResult(result);

        return {
            ...folder,
            refIds: {
                ...folder.refIds,
                toodledo: result.data[0].id
            }
        };
    };
}

export function editRemoteFolder(folder) {
    console.debug('editRemoteFolder', folder);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/folders/edit.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    ...convertFolderToToodledo(folder)
                }
            },
            settings);

        checkResult(result);
    };
}

export function deleteRemoteFolder(folder) {
    console.debug('deleteRemoteFolder', folder);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/folders/delete.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    id: folder.refIds.toodledo
                }
            },
            settings);

        // checkResult(result);
    };
}

function convertFolderToToodledo(folder) {
    return {
        id: folder.refIds.toodledo,
        name: folder.title,
        archived: folder.archived ? 1 : 0
    };
}

function convertFolderToTaskUnifier(folder) {
    return {
        refIds: {
            toodledo: folder.id
        },
        title: folder.name,
        archived: folder.archived === 1 ? true : false
    };
}