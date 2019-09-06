import { Auth } from 'aws-amplify';
import uuid from 'uuid/v4';
import { sendRequest } from 'actions/RequestActions';
import { updateTask } from 'actions/TaskActions';
import { updateProcess } from 'actions/ThreadActions';
import { getConfig } from 'config/Config';
import { getObjectById } from 'selectors/ObjectSelectors';

function loadTaskFromServer(task) {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                    },
                    method: 'GET',
                    url: `${getConfig().apiUrl}/v1/tasks/${task.id}`,
                    responseType: 'json'
                });

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return result.data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: `Load task "${task.title}" from server`,
                error: error.toString()
            }));

            throw error;
        }
    };
}

export const taskTextLoader = store => next => async action => {
    if (action.type === 'SET_SELECTED_TASK_IDS') {
        if (action.taskIds.length === 1) {
            const state = store.getState();
            const task = getObjectById(state, 'tasks', action.taskIds[0]);

            if (task && !('text' in task)) {
                const loadedTask = await store.dispatch(loadTaskFromServer(task));
                await store.dispatch(updateTask({
                    ...loadedTask,
                    text: loadedTask.text || null
                }));
            }
        }
    }

    return next(action);
}