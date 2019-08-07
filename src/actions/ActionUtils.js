import { Promise } from 'bluebird';
import uuid from 'uuid';
import { sendRequest } from 'actions/RequestActions';
import { updateProcess } from 'actions/ThreadActions';
import { getConfig } from 'config/Config';
import { getSettings } from 'selectors/SettingSelectors';
import {
    exists,
    getPath,
    join,
    lstat,
    mkdirp,
    readFile,
    readdir,
    rimraf,
    sep,
    writeFile
} from 'utils/ElectronUtils';
import { diff } from 'utils/ObjectUtils';

export function loadFromFile(property, file) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Load "${property}" from file`
        }));

        try {
            await exists(file);
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return null;
        }

        try {
            const data = await readFile(file, 'utf-8');

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return JSON.parse(data);
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

export function loadFromServer(property, options = { skipSetLoaded: false }) {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Load "${property}" from server`
        }));

        try {
            const result = await sendRequest(
                settings,
                {
                    withCredentials: true,
                    method: 'GET',
                    url: `${getConfig().apiUrl}/v1/${property}`,
                    responseType: 'json'
                });

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            if (!options || options.skipSetLoaded !== true) {
                result.data.forEach(object => object.state = 'LOADED');
            }

            return result.data;
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

export function saveToFile(property, file, data) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Save "${property}" to file`
        }));

        try {
            await writeFile(file, JSON.stringify(data, null, 4));

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

export function saveToServer(property, oldObject, newObject) {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);
        const processId = uuid();

        newObject = { ...newObject };

        delete newObject.refIds;
        delete newObject.state;
        delete newObject.creationDate;
        delete newObject.updateDate;

        if (oldObject) {
            oldObject = { ...oldObject };

            delete oldObject.refIds;
            delete oldObject.state;
            delete oldObject.creationDate;
            delete oldObject.updateDate;

            newObject = diff(newObject, oldObject);
        } else {
            delete newObject.id;
        }

        try {
            const result = await sendRequest(
                settings,
                {
                    withCredentials: true,
                    method: oldObject ? 'PUT' : 'POST',
                    url: `${getConfig().apiUrl}/v1/${property}` + (oldObject ? `/${oldObject.id}` : ''),
                    data: newObject,
                    responseType: 'json'
                });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: `Save "${newObject.title}" of type "${property}" to server`,
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function deleteFromServer(property, objectId) {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);
        const processId = uuid();

        try {
            await sendRequest(
                settings,
                {
                    withCredentials: true,
                    method: 'DELETE',
                    url: `${getConfig().apiUrl}/v1/${property}/${objectId}`
                });

            return;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: `Delete object of type "${property}" from server`,
                error: error.toString()
            }));

            throw error;
        }
    };
}

export async function saveBufferToFile(file, buffer) {
    await writeFile(file, buffer);
}

export function getPathSeparator() {
    return sep;
}

export function getUserDataPath() {
    if (process.env.REACT_APP_MODE === 'electron') {
        return getPath('userData');
    }

    return null;
}

export async function getDirectories(path) {
    const paths = (await readdir(path)).map(name => join(path, name));
    const lstats = await Promise.all(paths.map(path => lstat(path)));
    return paths.filter((item, i) => lstats[i].isDirectory());
}

export async function createDirectory(path) {
    try {
        await exists(path);
    } catch (error) {
        await mkdirp(path);
    }
}

export async function deleteDirectory(path, dataFolder) {
    if (path && (path.startsWith(getUserDataPath()) || path.startsWith(dataFolder))) {
        await rimraf(path);
    }
}