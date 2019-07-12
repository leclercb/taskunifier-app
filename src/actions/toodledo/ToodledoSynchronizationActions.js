import React from 'react';
import { Input, Modal, message } from 'antd';
import moment from 'moment';
import uuid from 'uuid';
import { updateSettings } from 'actions/SettingActions';
import { updateProcess } from 'actions/ThreadActions';
import { getAccountInfo } from 'actions/toodledo/ToodledoAccountInfoActions';
import { authorize, createToken, refreshToken } from 'actions/toodledo/ToodledoAuthorizationActions';
import { synchronizeContexts } from 'actions/toodledo/ToodledoContextActions';
import { synchronizeFolders } from 'actions/toodledo/ToodledoFolderActions';
import { synchronizeGoals } from 'actions/toodledo/ToodledoGoalActions';
import { synchronizeLocations } from 'actions/toodledo/ToodledoLocationActions';
import { synchronizeNotes } from 'actions/toodledo/ToodledoNoteActions';
import { synchronizeTasks } from 'actions/toodledo/ToodledoTaskActions';
import { getSettings } from 'selectors/SettingSelectors';

export function updateToodledoData(data) {
    return async dispatch => {
        dispatch({
            type: 'UPDATE_TOODLEDO_DATA',
            data
        });
    };
}

async function getAuthorizationCode() {
    return new Promise((resolve, reject) => {
        let code = null;

        Modal.confirm({
            title: 'Enter authorization code',
            content: (
                <Input onChange={event => code = event.target.value} />
            ),
            okText: 'Continue',
            onOk: () => {
                resolve(code);
            },
            onCancel: () => {
                reject('The connection to Toodledo has been cancelled');
            },
            width: 500
        });
    });
}

export function synchronizeWithToodledo() {
    return async (dispatch, getState) => {
        const processId = uuid();

        try {
            let settings = getSettings(getState());

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Synchronize with Toodledo',
                notify: true
            }));

            if (!settings.toodledo || !settings.toodledo.accessToken || !settings.toodledo.refreshToken) {
                message.info('Opening Toodledo\'s website... Please log into your account and enter the authorization code.', 10);

                await dispatch(authorize());
                const code = await getAuthorizationCode();
                await dispatch(createToken(code));

                settings = getSettings(getState());
            }

            const accessTokenCreationDate = moment(settings.toodledo.accessTokenCreationDate);
            const expirationDate = accessTokenCreationDate.add(settings.toodledo.accessTokenExpiresIn, 'seconds');

            if (moment().diff(expirationDate, 'seconds') > -60) {
                await dispatch(refreshToken());
            }

            try {
                await dispatch(getAccountInfo());
            } catch (error) {
                if (error.response && error.response.data && error.response.data.errorCode === 3) {
                    await dispatch(refreshToken());
                    await dispatch(getAccountInfo());
                } else {
                    throw error;
                }
            }

            await dispatch(synchronizeContexts());
            await dispatch(synchronizeFolders());
            await dispatch(synchronizeGoals());
            await dispatch(synchronizeLocations());

            await dispatch(synchronizeNotes());
            await dispatch(synchronizeTasks());

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