import { Auth } from 'aws-amplify';
import uuid from 'uuid/v4';
import { sendRequest } from 'actions/RequestActions';
import { updateProcess } from 'actions/ThreadActions';
import { getConfig } from 'config/Config';
import { getErrorMessages } from 'utils/CloudUtils';
import {
    exists,
    getPath,
    readFile,
    readdir,
    remove,
    writeFile
} from 'utils/ElectronUtils';
import { merge } from 'utils/ObjectUtils';

/**
 * Loads the data from the provided file.
 * 
 * The file can be a string or an object.
 * 
 * If the file is a string, it has to contain the path and the name of the file.
 * If the file is an object, it has to contain a property called "type".
 * 
 * If the "type" property equals "zip", then the object has to contain the following properties:
 * - type: "zip"
 * - zip: the zip instance
 * - name: the name of the file to read in the zip object
 * 
 * @param {*} property The name of the property being loaded
 * @param {*} file A string or an object
 */
export function loadFromFile(property, file) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Load "${property}" from file`
        }));

        try {
            if (typeof file === 'string') {
                await exists(file);
            } else {
                switch (file.type) {
                    case 'zip':
                        if (!file.zip.file(file.name)) {
                            throw new Error('File is missing');
                        }

                        break;
                    default:
                        throw new Error('Unsupported Operation');
                }
            }
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return null;
        }

        try {
            let data = null;

            if (typeof file === 'string') {
                data = await readFile(file, 'utf8');
            } else {
                switch (file.type) {
                    case 'zip':
                        data = await file.zip.file(file.name).async('string');
                        break;
                    default:
                        throw new Error('Unsupported Operation');
                }
            }

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

/**
 * Saves the provided data into the file.
 * 
 * The file can be a string or an object.
 * 
 * If the file is a string, it has to contain the path and the name of the file.
 * If the file is an object, it has to contain a property called "type".
 * 
 * If the "type" property equals "zip", then the object has to contain the following properties:
 * - type: "zip"
 * - zip: the zip instance
 * - name: the name of the file to create in the zip object
 * 
 * @param {*} property The name of the property being saved
 * @param {*} file A string or an object
 * @param {*} data The data to save
 */
export function saveToFile(property, file, data) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: `Save "${property}" to file`
        }));

        try {
            const content = JSON.stringify(data, null, 4);

            if (typeof file === 'string') {
                await writeFile(file, content);
            } else {
                switch (file.type) {
                    case 'zip':
                        file.zip.file(file.name, content);
                        break;
                    default:
                        throw new Error('Unsupported Operation');
                }
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

export async function readBufferFromFile(file) {
    return await readFile(file);
}

export async function saveBufferToFile(file, buffer) {
    await writeFile(file, buffer);
}

export function getUserDataPath() {
    if (process.env.REACT_APP_MODE === 'electron') {
        return getPath('userData');
    }

    return null;
}

export async function readDirectory(path) {
    return await readdir(path);
}

export async function deletePath(path, dataFolder) {
    if (path && (path.startsWith(getUserDataPath()) || path.startsWith(dataFolder))) {
        await remove(path);
    }
}