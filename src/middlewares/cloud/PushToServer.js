import React from 'react';
import { Modal } from 'antd';
import { Auth } from 'aws-amplify';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { setAccountManagerOptions } from 'actions/AppActions';
import { changeId } from 'actions/ObjectActions';
import { sendRequest } from 'actions/RequestActions';
import { updateProcess } from 'actions/ThreadActions';
import CloudMaxObjectsReachedMessage from 'components/pro/CloudMaxObjectsReachedMessage';
import { getConfig } from 'config/Config';
import { getObjectsByIds } from 'selectors/ObjectSelectors';
import { getErrorMessages } from 'utils/CloudUtils';
import { diff } from 'utils/ObjectUtils';

function pushObjectToServer(property, oldObject, newObject) {
    return async dispatch => {
        const processId = uuid();

        const diffObject = oldObject ? diff(newObject, oldObject) : { ...newObject };

        delete diffObject.owner;
        delete diffObject.id;
        delete diffObject.refIds;
        delete diffObject.state;
        delete diffObject.creationDate;
        delete diffObject.updateDate;

        if (oldObject && Object.keys(diffObject).length === 0) {
            return newObject;
        }

        try {
            const result = await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                    },
                    method: oldObject ? 'PUT' : 'POST',
                    url: `${getConfig().apiUrl}/v1/${property}/${oldObject ? oldObject.id : ''}`,
                    data: diffObject,
                    responseType: 'json'
                });

            return result.data;
        } catch (error) {
            if (!oldObject) {
                await dispatch({
                    type: 'DELETE_OBJECTS',
                    property,
                    generateId: () => uuid(),
                    updateDate: moment().toISOString(),
                    objectIds: [newObject.id],
                    options: {}
                });
            }

            if (error.response &&
                error.response.status === 403 &&
                error.response.data &&
                error.response.data.code === 'max_objects_reached') {
                const modal = Modal.info({
                    icon: null,
                    width: 800,
                    content: (
                        <CloudMaxObjectsReachedMessage setAccountManagerOptions={options => {
                            modal.destroy();
                            dispatch(setAccountManagerOptions(options));
                        }} />
                    )
                });
            } else {
                dispatch(updateProcess({
                    id: processId,
                    state: 'ERROR',
                    title: `Push "${newObject && newObject.title ? newObject.title : ''}" of type "${property}" to server`,
                    error: getErrorMessages(error, true)
                }));
            }

            throw error;
        }
    };
}

function pushSettingsToServer(oldSettings, newSettings) {
    return async dispatch => {
        const processId = uuid();

        const diffSettings = oldSettings ? diff(newSettings, oldSettings) : newSettings;

        if (Object.keys(diffSettings).length === 0) {
            return newSettings;
        }

        try {
            const result = await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                    },
                    method: 'PUT',
                    url: `${getConfig().apiUrl}/v1/settings`,
                    data: diffSettings,
                    responseType: 'json'
                });

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Save settings to server',
                error: getErrorMessages(error, true)
            }));

            throw error;
        }
    };
}

function deleteObjectFromServer(property, objectId) {
    return async dispatch => {
        const processId = uuid();

        try {
            await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                    },
                    method: 'DELETE',
                    url: `${getConfig().apiUrl}/v1/${property}/${objectId}`
                });
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

export const pushToServer = store => next => async action => {
    if (action.type === 'POST_ADD_OBJECTS') {
        const ids = [];

        for (let object of action.objects) {
            const remoteObject = await store.dispatch(pushObjectToServer(action.property, null, object));
            await store.dispatch(changeId(action.property, object.id, remoteObject.id));
            ids.push(remoteObject.id);
        }

        action.addedObjects = getObjectsByIds(store.getState(), action.property, ids);
    }

    if (action.type === 'POST_UPDATE_OBJECTS') {
        for (let object of action.objects) {
            if (!object.new.static) {
                await store.dispatch(pushObjectToServer(action.property, object.old, object.new));
            }
        }
    }

    if (action.type === 'POST_UPDATE_SETTINGS') {
        if (action.options.skipServerUpdate !== true) {
            if (action.options.skipDiff === true) {
                await store.dispatch(pushSettingsToServer(null, action.settings));
            } else {
                await store.dispatch(pushSettingsToServer(action.oldSettings, action.newSettings));
            }
        }
    }

    if (action.type === 'POST_DELETE_OBJECTS') {
        await Promise.all(action.objectIds.map(objectId => store.dispatch(deleteObjectFromServer(action.property, objectId))));
    }

    return next(action);
};