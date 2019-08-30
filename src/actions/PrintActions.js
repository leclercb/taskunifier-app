import sortBy from 'lodash/sortBy';
import uuid from 'uuid/v4';
import { createDirectory, saveBufferToFile } from 'actions/ActionUtils';
import { updateProcess } from 'actions/ThreadActions';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { join } from 'utils/ElectronUtils';
import { printDocument, printTable } from 'utils/PrintUtils';

export function printNotes(notes) {
    return (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const fields = getNoteFieldsIncludingDefaults(state);
        const sortedFields = sortBy(fields, field => settings['noteColumnOrder_' + field.id] || 0);
        const sortedAndFilteredFields = sortedFields.filter(field => settings['noteColumnVisible_' + field.id] !== false);

        return printObjects(
            dispatch,
            state,
            sortedAndFilteredFields,
            notes,
            'notes.pdf',
            'Notes',
            'Print notes');
    };
}

export function printTasks(tasks) {
    return (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const fields = getTaskFieldsIncludingDefaults(state);
        const sortedFields = sortBy(fields, field => settings['taskColumnOrder_' + field.id] || 0);
        const sortedAndFilteredFields = sortedFields.filter(field => settings['taskColumnVisible_' + field.id] !== false);

        return printObjects(
            dispatch,
            state,
            sortedAndFilteredFields,
            tasks,
            'tasks.pdf',
            'Tasks',
            'Print tasks');
    };
}

async function printObjects(dispatch, state, fields, objects, fileName, documentTitle, processTitle) {
    const processId = uuid();

    dispatch(updateProcess({
        id: processId,
        state: 'RUNNING',
        title: processTitle
    }));

    try {
        const doc = printDocument(documentTitle, 'l');
        printTable(doc, null, fields, objects, state);

        if (process.env.REACT_APP_MODE === 'electron') {
            const { ipcRenderer } = window.require('electron');
            const path = join(getSettings(state).dataFolder, 'temp');
            const file = join(path, fileName);

            await createDirectory(path);
            await saveBufferToFile(file, new Uint8Array(doc.output('arraybuffer')));
            ipcRenderer.send('pdf-viewer', file);
        } else {
            doc.save(fileName);
        }

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