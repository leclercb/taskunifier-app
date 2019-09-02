import React from 'react';
import { Input, Modal, message } from 'antd';
import moment from 'moment';
import uuid from 'uuid/v4';
import { updateSettings } from 'actions/SettingActions';
import { checkIsBusy, updateProcess } from 'actions/ThreadActions';
import { getToodledoAccountInfo } from 'actions/synchronization/toodledo/ToodledoAccountInfoActions';
import { authorize, createToken, refreshToken } from 'actions/synchronization/toodledo/ToodledoAuthorizationActions';
import { synchronizeContexts } from 'actions/synchronization/toodledo/ToodledoContextActions';
import { synchronizeFolders } from 'actions/synchronization/toodledo/ToodledoFolderActions';
import { synchronizeGoals } from 'actions/synchronization/toodledo/ToodledoGoalActions';
import { synchronizeLocations } from 'actions/synchronization/toodledo/ToodledoLocationActions';
import { synchronizeNotes } from 'actions/synchronization/toodledo/ToodledoNoteActions';
import { synchronizeTasks } from 'actions/synchronization/toodledo/ToodledoTaskActions';
import { getSettings } from 'selectors/SettingSelectors';

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
        await dispatch(checkIsBusy());

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
                await dispatch(getToodledoAccountInfo());
            } catch (error) {
                if (error.response && error.response.data && error.response.data.errorCode === 3) {
                    await dispatch(refreshToken());
                    await dispatch(getToodledoAccountInfo());
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

            if (error.response && error.response.data && error.response.data.errorCode === 102) {
                await dispatch(updateSettings({
                    toodledo: null
                }));
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