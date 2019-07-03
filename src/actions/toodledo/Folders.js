import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/toodledo/ExceptionHandler';

export async function getRemoteFolders(settings) {
    const result = await sendRequest(
        settings,
        {
            method: 'GET',
            url: 'https://api.toodledo.com/3/folders/get.php',
            params: {
                access_token: settings.toodledo.accessToken
            }
        });

    return result.map(folder => convertFolderToTaskUnifier(folder));
}

export async function addRemoteFolder(settings, folder) {
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

    folder.refIds.toodledo = result.data[0].id;
}

export async function editRemoteFolder(settings, folder) {
    const result = await sendRequest(
        settings,
        {
            method: 'POST',
            url: 'https://api.toodledo.com/3/folders/edit.php',
            data: {
                access_token: settings.toodledo.accessToken,
                ...convertFolderToToodledo(folder)
            }
        });

    checkResult(result);
}

export async function deleteRemoteFolder(settings, folder) {
    const result = await sendRequest(
        settings,
        {
            method: 'POST',
            url: 'https://api.toodledo.com/3/folders/delete.php',
            data: {
                access_token: settings.toodledo.accessToken,
                id: folder.refIds.toodledo
            }
        });

    checkResult(result);
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
    }
}