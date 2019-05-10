import { printDocument, printTable } from 'utils/PrintUtils';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';

export function printNotes(notes) {
    return (dispatch, getState) => {
        const state = getState();
        const doc = printDocument('Notes', 'l');

        printTable(doc, null, getNoteFieldsIncludingDefaults(state), notes, state);

        doc.save('notes.pdf');

        return Promise.resolve();
    };
}

export function printTasks(tasks) {
    return (dispatch, getState) => {
        const state = getState();
        const doc = printDocument('Tasks', 'l');

        printTable(doc, null, getTaskFieldsIncludingDefaults(state), tasks, state);

        doc.save('tasks.pdf');

        return Promise.resolve();
    };
}