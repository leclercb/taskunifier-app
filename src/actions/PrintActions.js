import uuid from 'uuid';
import { createDirectory, join, saveBufferToFile } from 'actions/ActionUtils';
import { updateProcess } from 'actions/ThreadActions';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { delay } from 'utils/DelayUtils';
import { printDocument, printTable } from 'utils/PrintUtils';

const { ipcRenderer } = window.require('electron');

export function printNotes(tasks) {
    return (dispatch, getState) => {
        const state = getState();

        return printObjects(
            dispatch,
            state,
            getNoteFieldsIncludingDefaults(state),
            tasks,
            'notes.pdf',
            'Notes',
            'Print notes');
    };
}

export function printTasks(tasks) {
    return (dispatch, getState) => {
        const state = getState();

        return printObjects(
            dispatch,
            state,
            getTaskFieldsIncludingDefaults(state),
            tasks,
            'tasks.pdf',
            'Tasks',
            'Print tasks');
    };
}

async function printObjects(dispatch, state, fields, objects, fileName, documentTitle, processTitle) {
    const processId = uuid();
    const path = join(getSettings(state).dataFolder, 'temp');
    const file = join(path, fileName);
    const doc = printDocument(documentTitle, 'l');

    dispatch(updateProcess({
        id: processId,
        state: 'RUNNING',
        title: processTitle
    }));

    try {
        await (delay);

        printTable(doc, null, fields, objects, state);

        await createDirectory(path);

        await saveBufferToFile(file, new Uint8Array(doc.output('arraybuffer')));

        ipcRenderer.send('pdf-viewer', file);

        dispatch(updateProcess({
            id: processId,
            state: 'COMPLETED'
        }));
    } catch (error) {
        dispatch(updateProcess({
            id: processId,
            state: 'ERROR'
        }));

        throw error;
    }
}