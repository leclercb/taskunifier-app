import React from 'react';
import { Input, Modal, message } from 'antd';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { updateSettings } from 'actions/SettingActions';
import { updateProcess } from 'actions/ThreadActions';
import { getGoogleCalAccountInfo } from 'actions/publication/googlecal/GoogleCalAccountInfoActions';
import { authorize, createToken } from 'actions/publication/googlecal/GoogleCalAuthorizationActions';
import { publishEvents } from 'actions/publication/googlecal/GoogleCalEventActions';
import { getSettings } from 'selectors/SettingSelectors';
import logger from 'utils/LogUtils';

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
                reject('The connection to Google Calendar has been cancelled');
            },
            width: 500
        });
    });
}

export function connectToGoogleCal() {
    return async (dispatch, getState) => {
        let settings = getSettings(getState());

        if (!settings.googlecal || !settings.googlecal.tokens) {
            message.info('Opening Google Calendar\'s website... Please log into your account and enter the authorization code.', 10);

            await dispatch(authorize());
            const code = await getAuthorizationCode();
            await dispatch(createToken(code));
        }
    };
}

export function publishToGoogleCal() {
    return async (dispatch, getState) => {
        const processId = uuid();

        try {
            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Publish to Google Calendar',
                notify: true
            }));

            let settings = getSettings(getState());

            if (settings.proxyEnabled) {
                throw new Error('Google Calendar publication is not working behind a proxy');
            }

            await dispatch(connectToGoogleCal());

            await dispatch(getGoogleCalAccountInfo());

            await dispatch(publishEvents());

            await dispatch(updateSettings({
                lastPublicationDate: moment().toISOString()
            }));

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            logger.error('Publish to Google Calendar error', error);

            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}