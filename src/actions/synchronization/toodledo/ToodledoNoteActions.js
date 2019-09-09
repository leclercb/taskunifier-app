import moment from 'moment';
import qs from 'qs';
import { addNote, deleteNote, updateNote } from 'actions/NoteActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/toodledo/ExceptionHandler';
import { getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';
import { getNotes } from 'selectors/NoteSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

const CHUNK_SIZE = 50;

export function synchronizeNotes() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let notes = getNotes(getState());

        {
            const notesToAdd = filterByVisibleState(notes).filter(note => !note.refIds.toodledo);

            if (notesToAdd.length > 0) {
                const result = await dispatch(addRemoteNotes(notesToAdd));

                for (let note of result) {
                    await dispatch(updateNote(note, { loaded: true }));
                }
            }
        }

        notes = getNotes(getState());

        {
            const notesToDelete = notes.filter(note => !!note.refIds.toodledo && note.state === 'TO_DELETE');

            if (notesToDelete.length > 0) {
                await dispatch(deleteRemoteNotes(notesToDelete));
            }

            for (let note of notesToDelete) {
                await dispatch(deleteNote(note.id));
            }
        }

        notes = getNotes(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditNote = moment.unix(getToodledoAccountInfo(getState()).lastedit_note);

            if (!lastSync || lastEditNote.diff(lastSync) > 0) {
                const remoteNotes = await dispatch(getRemoteNotes(lastSync));

                for (let remoteNote of remoteNotes) {
                    const localNote = notes.find(note => note.refIds.toodledo === remoteNote.refIds.toodledo);

                    if (!localNote) {
                        await dispatch(addNote(remoteNote, { keepRefIds: true }));
                    } else {
                        if (moment(remoteNote.updateDate).diff(moment(localNote.updateDate)) > 0) {
                            await dispatch(updateNote(merge(localNote, remoteNote), { loaded: true }));
                        }
                    }
                }
            }
        }

        notes = getNotes(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastDeleteNote = moment.unix(getToodledoAccountInfo(getState()).lastdelete_note);

            if (!lastSync || lastDeleteNote.diff(lastSync) > 0) {
                const remoteDeletedNotes = await dispatch(getRemoteDeletedNotes(lastSync));

                for (let remoteDeletedNote of remoteDeletedNotes) {
                    const localNote = notes.find(note => note.refIds.toodledo === remoteDeletedNote.id);

                    if (localNote) {
                        await dispatch(deleteNote(localNote.id, { force: true }));
                    }
                }
            }
        }

        notes = getNotes(getState());

        {
            const notesToUpdate = notes.filter(note => !!note.refIds.toodledo && note.state === 'TO_UPDATE');

            if (notesToUpdate.length > 0) {
                await dispatch(editRemoteNotes(notesToUpdate));
            }

            for (let note of notesToUpdate) {
                await dispatch(updateNote(note, { loaded: true }));
            }
        }
    };
}

export function getRemoteNotes(updatedAfter) {
    console.debug('getRemoteNotes', updatedAfter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/notes/get.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    after: updatedAfter ? updatedAfter.unix() : 0
                })
            },
            settings);

        console.debug(result);
        checkResult(result);

        return result.data.slice(1).map(note => convertNoteToLocal(note, state));
    };
}

export function getRemoteDeletedNotes(deletedAfter) {
    console.debug('getRemoteDeletedNotes', deletedAfter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/notes/deleted.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    after: deletedAfter ? deletedAfter.unix() : 0
                })
            },
            settings);

        console.debug(result);
        checkResult(result);

        return result.data.slice(1).map(note => ({ id: note.id }));
    };
}

export function addRemoteNotes(notes) {
    console.debug('addRemoteNotes', notes);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const updatedNotes = [];

        for (let i = 0; i < notes.length; i += CHUNK_SIZE) {
            const chunkNotes = notes.slice(i, i + CHUNK_SIZE);

            const result = await sendRequest(
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/notes/add.php',
                    data: qs.stringify({
                        access_token: settings.toodledo.accessToken,
                        notes: JSON.stringify(chunkNotes.map(note => convertNoteToRemote(note, state)))
                    })
                },
                settings);

            checkResult(result);

            for (let j = 0; j < chunkNotes.length; j++) {
                updatedNotes.push({
                    ...chunkNotes[j],
                    refIds: {
                        ...chunkNotes[j].refIds,
                        toodledo: result.data[j].id
                    }
                });
            }
        }

        return updatedNotes;
    };
}

export function editRemoteNotes(notes) {
    console.debug('editRemoteNotes', notes);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        for (let i = 0; i < notes.length; i += CHUNK_SIZE) {
            const chunkNotes = notes.slice(i, i + CHUNK_SIZE);

            const result = await sendRequest(
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: 'https://api.toodledo.com/3/notes/edit.php',
                    data: qs.stringify({
                        access_token: settings.toodledo.accessToken,
                        notes: JSON.stringify(chunkNotes.map(note => convertNoteToRemote(note, state)))
                    })
                },
                settings);

            checkResult(result);
        }
    };
}

export function deleteRemoteNotes(notes) {
    console.debug('deleteRemoteNotes', notes);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        for (let i = 0; i < notes.length; i += CHUNK_SIZE) {
            const chunkNotes = notes.slice(i, i + CHUNK_SIZE);

            try {
                await sendRequest(
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        url: 'https://api.toodledo.com/3/notes/delete.php',
                        data: qs.stringify({
                            access_token: settings.toodledo.accessToken,
                            notes: JSON.stringify(chunkNotes.map(note => note.refIds.toodledo))
                        })
                    },
                    settings);

                // checkResult(result);
            } catch (error) {
                if (!error.response || !error.response.data || error.response.data.errorCode !== 605) {
                    throw error;
                }
            }
        }
    };
}

function convertNoteToRemote(note, state) {
    const folders = getFoldersFilteredByVisibleState(state);
    const folder = folders.find(folder => folder.id === note.folder);

    return {
        id: note.refIds.toodledo,
        title: note.title,
        folder: folder ? folder.refIds.toodledo : 0,
        text: note.text
    };
}

function convertNoteToLocal(note, state) {
    const folders = getFoldersFilteredByVisibleState(state);
    const folder = folders.find(folder => folder.refIds.toodledo === note.folder);

    return {
        updateDate: moment.unix(note.modified).toISOString(),
        refIds: {
            toodledo: note.id
        },
        title: note.title,
        folder: folder ? folder.refIds.toodledo : null,
        text: note.text
    };
}