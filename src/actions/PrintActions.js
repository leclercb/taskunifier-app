import uuid from 'uuid';
import { updateProcess } from 'actions/ThreadActions';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { createDirectory, join, saveBufferToFile } from 'utils/ActionUtils';
import { printDocument, printTable } from 'utils/PrintUtils';

const electron = window.require('electron');

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

function printObjects(dispatch, state, fields, objects, fileName, documentTitle, processTitle) {
    return new Promise((resolve, reject) => {
        const processId = uuid();
        const path = join(getSettings(state).dataFolder, 'temp');
        const file = join(path, fileName);
        const doc = printDocument(documentTitle, 'l');

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: processTitle
        }));

        setTimeout(() => {
            printTable(doc, null, fields, objects, state);

            createDirectory(path);

            saveBufferToFile(
                file,
                new Uint8Array(doc.output('arraybuffer'))).then(() => {
                    electron.ipcRenderer.send('pdf-viewer', file);

                    dispatch(updateProcess({
                        id: processId,
                        state: 'COMPLETED'
                    }));

                    resolve();
                }).catch(() => {
                    dispatch(updateProcess({
                        id: processId,
                        state: 'ERROR'
                    }));

                    reject();
                });
        });
    });
}