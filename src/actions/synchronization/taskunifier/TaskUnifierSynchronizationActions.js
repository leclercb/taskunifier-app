import React from 'react';
import { Input, Modal, message } from 'antd';
import moment from 'moment';
import uuid from 'uuid/v4';
import { resetData } from 'actions/AppActions';
import { updateSettings } from 'actions/SettingActions';
import { checkIsBusy, updateProcess } from 'actions/ThreadActions';
import { getTaskUnifierAccountInfo } from 'actions/synchronization/taskunifier/TaskUnifierAccountInfoActions';
import { authorize, createToken, refreshToken } from 'actions/synchronization/taskunifier/TaskUnifierAuthorizationActions';
import { synchronizeContacts } from 'actions/synchronization/taskunifier/TaskUnifierContactActions';
import { synchronizeContexts } from 'actions/synchronization/taskunifier/TaskUnifierContextActions';
import { synchronizeFolders } from 'actions/synchronization/taskunifier/TaskUnifierFolderActions';
import { synchronizeGoals } from 'actions/synchronization/taskunifier/TaskUnifierGoalActions';
import { synchronizeLocations } from 'actions/synchronization/taskunifier/TaskUnifierLocationActions';
import { synchronizeNotes } from 'actions/synchronization/taskunifier/TaskUnifierNoteActions';
import { synchronizeNoteFields } from 'actions/synchronization/taskunifier/TaskUnifierNoteFieldActions';
import { synchronizeTasks } from 'actions/synchronization/taskunifier/TaskUnifierTaskActions';
import { synchronizeTaskFields } from 'actions/synchronization/taskunifier/TaskUnifierTaskFieldActions';
import { getSettings } from 'selectors/SettingSelectors';
import { getErrorMessages } from 'utils/CloudUtils';

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
                reject('The connection to TaskUnifier has been cancelled');
            },
            width: 500
        });
    });
}

export function synchronizeWithTaskUnifier() {
    return async (dispatch, getState) => {
        await dispatch(checkIsBusy());

        const processId = uuid();

        try {
            let settings = getSettings(getState());

            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Synchronize with TaskUnifier',
                notify: true
            }));

            if (!settings.taskunifier || !settings.taskunifier.accessToken || !settings.taskunifier.refreshToken) {
                message.info('Opening TaskUnifier\'s website... Please log into your account and enter the authorization code.', 10);

                await dispatch(authorize());
                const code = await getAuthorizationCode();
                await dispatch(createToken(code));

                settings = getSettings(getState());
            }

            const accessTokenCreationDate = moment(settings.taskunifier.accessTokenCreationDate);
            const expirationDate = moment(accessTokenCreationDate).add(settings.taskunifier.accessTokenExpiresIn, 'seconds');

            if (moment().diff(expirationDate, 'seconds') > -60) {
                await dispatch(refreshToken());
            }

            await dispatch(getTaskUnifierAccountInfo());

            await dispatch(synchronizeContacts());
            await dispatch(synchronizeContexts());
            await dispatch(synchronizeFolders());
            await dispatch(synchronizeGoals());
            await dispatch(synchronizeLocations());
            await dispatch(synchronizeNoteFields());
            await dispatch(synchronizeTaskFields());

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
            console.error(error);

            if (error.response) {
                console.error(error.response);
            }

            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: getErrorMessages(error)
            }));

            throw error;
        }
    };
}

export function resetDataForTaskUnifierSynchronization() {
    return resetData({
        resetAll: true
    });
}