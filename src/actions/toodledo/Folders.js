import { updateFolder, deleteFolder } from 'actions/FolderActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/toodledo/ExceptionHandler';
import { getSettings } from 'selectors/SettingSelectors';

export function getRemoteFolders() {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'GET',
                url: 'https://api.toodledo.com/3/folders/get.php',
                params: {
                    access_token: settings.toodledo.accessToken
                }
            });

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
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/folders/add.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    ...convertFolderToToodledo(folder)
                }
            });

        checkResult(result);

        await dispatch(updateFolder({
            ...folder,
            refIds: {
                ...folder.refIds,
                toodledo: result.data[0].id
            }
        }));
    };
}

export function editRemoteFolder(folder) {
    console.debug('editRemoteFolder', folder);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/folders/edit.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    ...convertFolderToToodledo(folder)
                }
            });

        checkResult(result);
    };
}

export function deleteRemoteFolder(folder) {
    console.debug('deleteRemoteFolder', folder);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/folders/delete.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    id: folder.refIds.toodledo
                }
            });

        // checkResult(result);

        await dispatch(deleteFolder(folder.id));
    };
}

export function convertFolderToToodledo(folder) {
    return {
        id: folder.refIds.toodledo,
        name: folder.title,
        archived: folder.archived ? 1 : 0
    };
}

export function convertFolderToTaskUnifier(folder) {
    return {
        refIds: {
            toodledo: folder.id
        },
        title: folder.name,
        archived: folder.archived === 1 ? true : false
    };
}