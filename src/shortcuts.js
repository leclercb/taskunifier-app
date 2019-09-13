import Mousetrap from 'mousetrap';
import { store } from 'store/Store';
import { setEditingCell, setSelectedNoteIds, setSelectedTaskIds } from 'actions/AppActions';
import { addNote } from 'actions/NoteActions';
import { addTask } from 'actions/TaskActions';
import { setSelectedView } from 'actions/SettingActions';

export function initializeShortcuts() {
    if (process.env.REACT_APP_MODE === 'electron') {
        const { ipcRenderer } = window.require('electron');

        ipcRenderer.on('menu-add-note', async () => {
            await executeAddNote();
        });

        ipcRenderer.on('menu-add-task', async () => {
            await executeAddTask();
        });
    } else {
        Mousetrap.bind(['command+alt+n', 'ctrl+shift+n'], async () => {
            await executeAddNote();
            return false;
        });

        Mousetrap.bind(['command+alt+t', 'ctrl+shift+t'], async () => {
            await executeAddTask();
            return false;
        });
    }
}

async function executeAddNote() {
    await store.dispatch(setSelectedView('note'));
    const note = await store.dispatch(addNote());
    await store.dispatch(setSelectedNoteIds(note.id));
    await store.dispatch(setEditingCell(note.id, 'title'));
}

async function executeAddTask() {
    await store.dispatch(setSelectedView('task'));
    const task = await store.dispatch(addTask());
    await store.dispatch(setSelectedTaskIds(task.id));
    await store.dispatch(setEditingCell(task.id, 'title'));
}