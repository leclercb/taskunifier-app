import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { saveBufferToFile, join, createDirectory } from 'utils/ActionUtils';
import { printDocument, printTable } from 'utils/PrintUtils';

const electron = window.require('electron');

export function printNotes(notes) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const path = join(getSettings(state).dataFolder, 'temp');
            const file = join(path, 'notes.pdf');
            const doc = printDocument('Notes', 'l');

            printTable(doc, null, getNoteFieldsIncludingDefaults(state), notes, state);

            createDirectory(path);

            saveBufferToFile(
                file,
                new Uint8Array(doc.output('arraybuffer'))).then(() => {
                    electron.ipcRenderer.send('pdf-viewer', file);
                    resolve();
                }).catch(() => {
                    reject();
                });
        });
    };
}

export function printTasks(tasks) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const path = join(getSettings(state).dataFolder, 'temp');
            const file = join(path, 'tasks.pdf');
            const doc = printDocument('Tasks', 'l');

            printTable(doc, null, getTaskFieldsIncludingDefaults(state), tasks, state);

            createDirectory(path);

            saveBufferToFile(
                file,
                new Uint8Array(doc.output('arraybuffer'))).then(() => {
                    electron.ipcRenderer.send('pdf-viewer', file);
                    resolve();
                }).catch(() => {
                    reject();
                });
        });
    };
}