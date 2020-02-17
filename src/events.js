import { executeAddNote, executeAddTask } from './shortcuts';

export function initializeEvents() {
    if (process.env.REACT_APP_MODE === 'electron') {
        const { ipcRenderer } = window.require('electron');

        ipcRenderer.on('open-url', async (event, url) => {
            console.debug('Open URL', url);

            const u = new URL(url);

            switch (u.pathname) {
                case '//notes/add':
                    executeAddNote(note => {
                        if (u.searchParams.get('title')) {
                            note.title = u.searchParams.get('title');
                        }
                    });
                    break;
                case '//tasks/add':
                    executeAddTask(task => {
                        if (u.searchParams.get('title')) {
                            task.title = u.searchParams.get('title');
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    }
}