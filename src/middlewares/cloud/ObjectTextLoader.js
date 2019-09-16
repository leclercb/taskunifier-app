import { Auth } from 'aws-amplify';
import uuid from 'uuid/v4';
import { updateNote } from 'actions/NoteActions';
import { sendRequest } from 'actions/RequestActions';
import { updateTask } from 'actions/TaskActions';
import { updateProcess } from 'actions/ThreadActions';
import { getConfig } from 'config/Config';
import { getObjectById } from 'selectors/ObjectSelectors';
import { getErrorMessages } from 'utils/CloudUtils';

function loadObjectFromServer(property, object) {
    return async dispatch => {
        const processId = uuid();

        try {
            const result = await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
                    },
                    method: 'GET',
                    url: `${getConfig().apiUrl}/v1/${property}/${object.id}`,
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
                title: `Load "${object.title}" from server`,
                error: getErrorMessages(error, true)
            }));

            throw error;
        }
    };
}

export const objectTextLoader = store => next => async action => {
    const result = next(action);

    if (action.type === 'SET_SELECTED_NOTE_IDS') {
        if (action.noteIds.length === 1) {
            const state = store.getState();
            const note = getObjectById(state, 'notes', action.noteIds[0]);

            if (note && !('text' in note)) {
                const loadedNote = await store.dispatch(loadObjectFromServer('notes', note));
                await store.dispatch(updateNote({
                    ...loadedNote,
                    text: loadedNote.text || null
                }));
            }
        }
    }

    if (action.type === 'SET_SELECTED_TASK_IDS') {
        if (action.taskIds.length === 1) {
            const state = store.getState();
            const task = getObjectById(state, 'tasks', action.taskIds[0]);

            if (task && !('text' in task)) {
                const loadedTask = await store.dispatch(loadObjectFromServer('tasks', task));
                await store.dispatch(updateTask({
                    ...loadedTask,
                    text: loadedTask.text || null
                }));
            }
        }
    }

    return result;
};