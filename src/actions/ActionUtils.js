import { Auth } from 'aws-amplify';
import { Promise } from 'bluebird';
import uuid from 'uuid/v4';
import { sendRequest } from 'actions/RequestActions';
import { updateProcess } from 'actions/ThreadActions';
import { getConfig } from 'config/Config';
import { getErrorMessages } from 'utils/CloudUtils';
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
import { merge } from 'utils/ObjectUtils';

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

export function loadFromServer(property, options, params) {
    options = merge({
        skipSetLoaded: false
    }, options || {});

    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Load "${property}" from server`
        }));

        try {
            const result = await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                    },
                    method: 'GET',
                    url: `${getConfig().apiUrl}/v1/${property}`,
                    params,
                    responseType: 'json'
                });

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            if (options.skipSetLoaded !== true) {
                result.data.forEach(object => object.state = 'LOADED');
            }

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: getErrorMessages(error, true)
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