import Mousetrap from 'mousetrap';
import { store } from 'store/Store';
import { addNote } from 'actions/NoteActions';
import { addTask } from 'actions/TaskActions';

export function initializeShortcuts() {
    if (process.env.REACT_APP_MODE === 'electron') {
        const { ipcRenderer } = window.require('electron');

        ipcRenderer.on('menu-add-note', async () => {
            await store.dispatch(addNote());
        });

        ipcRenderer.on('menu-add-task', async () => {
            await store.dispatch(addTask());
        });
    } else {
        Mousetrap.bind(['command+alt+n', 'ctrl+shift+n'], async () => {
            await store.dispatch(addNote());
            return false;
        });

        Mousetrap.bind(['command+alt+t', 'ctrl+shift+t'], async () => {
            await store.dispatch(addTask());
            return false;
        });
    }
}