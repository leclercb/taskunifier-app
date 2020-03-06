import React from 'react';
import { Input, Modal, message } from 'antd';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { resetData } from 'actions/AppActions';
import { updateProcess } from 'actions/ThreadActions';
import { getTaskUnifierAccountInfo } from 'actions/synchronization/taskunifier/TaskUnifierAccountInfoActions';
import { authorize, createToken, refreshToken } from 'actions/synchronization/taskunifier/TaskUnifierAuthorizationActions';
import { synchronizeContacts } from 'actions/synchronization/taskunifier/TaskUnifierContactActions';
import { synchronizeContexts } from 'actions/synchronization/taskunifier/TaskUnifierContextActions';
import { synchronizeFolders } from 'actions/synchronization/taskunifier/TaskUnifierFolderActions';
import { synchronizeGoals } from 'actions/synchronization/taskunifier/TaskUnifierGoalActions';
import { synchronizeLocations } from 'actions/synchronization/taskunifier/TaskUnifierLocationActions';
import { synchronizeNotes } from 'actions/synchronization/taskunifier/TaskUnifierNoteActions';
import { synchronizeNoteFields } from 'actions/synchronization/taskunifier/TaskUnifierNoteFieldActions';
import { synchronizeNoteFilters } from 'actions/synchronization/taskunifier/TaskUnifierNoteFilterActions';
import { synchronizeTasks } from 'actions/synchronization/taskunifier/TaskUnifierTaskActions';
import { synchronizeTaskFields } from 'actions/synchronization/taskunifier/TaskUnifierTaskFieldActions';
import { synchronizeTaskFilters } from 'actions/synchronization/taskunifier/TaskUnifierTaskFilterActions';
import { synchronizeTaskTemplates } from 'actions/synchronization/taskunifier/TaskUnifierTaskTemplateActions';
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

export function connectToTaskUnifier() {
    return async (dispatch, getState) => {
        let settings = getSettings(getState());

        if (!settings.taskunifier || !settings.taskunifier.accessToken || !settings.taskunifier.refreshToken) {
            message.info('Opening TaskUnifier\'s website... Please log into your account and enter the authorization code.', 10);

            await dispatch(authorize());
            const code = await getAuthorizationCode();
            await dispatch(createToken(code));

            settings = getSettings(getState());
        }

        const accessTokenCreationDate = moment(settings.taskunifier.accessTokenCreationDate);
        const expirationDate = moment(accessTokenCreationDate).add(settings.taskunifier.accessTokenExpiresIn, 'second');

        if (moment().diff(expirationDate, 'second') > -60) {
            await dispatch(refreshToken());
        }
    };
}

export function synchronizeWithTaskUnifier() {
    return async dispatch => {
        const processId = uuid();

        try {
            dispatch(updateProcess({
                id: processId,
                state: 'RUNNING',
                title: 'Synchronize with TaskUnifier',
                notify: true
            }));

            await dispatch(connectToTaskUnifier());

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

            await dispatch(synchronizeNoteFilters());
            await dispatch(synchronizeTaskFilters());
            await dispatch(synchronizeTaskTemplates());

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