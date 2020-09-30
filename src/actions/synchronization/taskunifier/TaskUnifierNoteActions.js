import moment from 'moment';
import { addNote, deleteNote, updateNote } from 'actions/NoteActions';
import { sendRequest } from 'actions/RequestActions';
import { convertFieldsToLocal, convertFieldsToRemote } from 'actions/synchronization/taskunifier/TaskUnifierUtils';
import { getConfig } from 'config/Config';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getNotes } from 'selectors/NoteSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { diff, merge } from 'utils/ObjectUtils';

const CHUNK_SIZE = 50;

export function synchronizeNotes() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let notes = getNotes(getState());

        {
            const notesToAdd = filterByVisibleState(notes).filter(note => !note.refIds.taskunifier);

            if (notesToAdd.length > 0) {
                const result = await dispatch(addRemoteNotes(notesToAdd));

                await dispatch(updateNote(result, { loaded: true, skipUpdateMiddleware: true }));
            }
        }

        notes = getNotes(getState());

        {
            const notesToDelete = notes.filter(note => !!note.refIds.taskunifier && note.state === 'TO_DELETE');

            if (notesToDelete.length > 0) {
                await dispatch(deleteRemoteNotes(notesToDelete));
            }

            await dispatch(deleteNote(notesToDelete.map(note => note.id)));
        }

        notes = getNotes(getState());

        const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;

        const notesToAdd = [];
        const notesToUpdate = [];
        const remoteNotes = await dispatch(getRemoteNotes(lastSync));

        for (let remoteNote of remoteNotes) {
            const localNote = notes.find(note => note.refIds.taskunifier === remoteNote.refIds.taskunifier);

            if (!localNote) {
                notesToAdd.push(remoteNote);
            } else {
                if (moment(remoteNote.updateDate).diff(moment(localNote.updateDate)) > 0) {
                    notesToUpdate.push(merge(localNote, remoteNote));
                }
            }
        }

        await dispatch(addNote(notesToAdd, { keepRefIds: true }));
        await dispatch(updateNote(notesToUpdate, { loaded: true, skipUpdateMiddleware: true }));

        notes = getNotes(getState());

        {
            const notesToDelete = [];
            const remoteDeletedNotes = await dispatch(getRemoteDeletedNotes(lastSync));

            for (let remoteDeletedNote of remoteDeletedNotes) {
                const localNote = notes.find(note => note.refIds.taskunifier === remoteDeletedNote.id);

                if (localNote) {
                    notesToDelete.push(localNote);
                }
            }

            await dispatch(deleteNote(notesToDelete.map(note => note.id), { force: true }));
        }

        notes = getNotes(getState());

        {
            const notesToUpdate = notes.filter(note => !!note.refIds.taskunifier && note.state === 'TO_UPDATE');

            if (notesToUpdate.length > 0) {
                await dispatch(editRemoteNotes(notesToUpdate, remoteNotes));
            }

            await dispatch(updateNote(notesToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteNotes(updatedAfter) {
    logger.debug('Get remote notes', updatedAfter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/notes`,
                query: {
                    includeText: true,
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(note => convertNoteToLocal(note, state));
    };
}

export function getRemoteDeletedNotes(deletedAfter) {
    logger.debug('Get remote deleted notes', deletedAfter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/deletedNotes`,
                query: {
                    deletedAfter: deletedAfter ? deletedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(note => ({ id: note.id }));
    };
}

export function addRemoteNotes(notes) {
    logger.debug('Add remote notes', notes.length);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const updatedNotes = [];

        for (let i = 0; i < notes.length; i += CHUNK_SIZE) {
            const chunkNotes = notes.slice(i, i + CHUNK_SIZE);

            const result = await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'POST',
                    url: `${getConfig().apiUrl}/v1/notes/batch`,
                    data: chunkNotes.map(note => convertNoteToRemote(note, state))
                },
                settings);

            for (let j = 0; j < chunkNotes.length; j++) {
                updatedNotes.push({
                    ...chunkNotes[j],
                    refIds: {
                        ...chunkNotes[j].refIds,
                        taskunifier: result.data[j].id
                    }
                });
            }
        }

        return updatedNotes;
    };
}

export function editRemoteNotes(notes, remoteNotes) {
    logger.debug('Edit remote notes', notes.length);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        for (let i = 0; i < notes.length; i += CHUNK_SIZE) {
            const chunkNotes = notes.slice(i, i + CHUNK_SIZE);

            await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'PUT',
                    url: `${getConfig().apiUrl}/v1/notes/batch`,
                    data: chunkNotes.map(note => {
                        const remoteNote = remoteNotes.find(remoteNote => remoteNote.refIds.taskunifier === note.refIds.taskunifier);
                        let convertedNote = convertNoteToRemote(note, state);

                        if (remoteNote) {
                            convertedNote = diff(convertedNote, convertNoteToRemote(remoteNote, state));
                        }

                        return {
                            ...convertedNote,
                            id: note.refIds.taskunifier
                        };
                    }).filter(note => Object.keys(note).length > 0)
                },
                settings);
        }
    };
}

export function deleteRemoteNotes(notes) {
    logger.debug('Delete remote notes', notes.length);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        for (let i = 0; i < notes.length; i += CHUNK_SIZE) {
            const chunkNotes = notes.slice(i, i + CHUNK_SIZE);

            try {
                await sendRequest(
                    {
                        headers: {
                            Authorization: `Bearer ${settings.taskunifier.accessToken}`
                        },
                        method: 'DELETE',
                        url: `${getConfig().apiUrl}/v1/notes/batch`,
                        params: {
                            id: chunkNotes.map(note => note.refIds.taskunifier)
                        }
                    },
                    settings);
            } catch (error) {
                // No throw exception if delete fails
                logger.debug('Delete remote notes error', error);
            }
        }
    };
}

function convertNoteToRemote(note, state) {
    const remoteNote = {
        ...convertFieldsToRemote(getNoteFieldsIncludingDefaults(state), state, note)
    };

    delete remoteNote.id;
    delete remoteNote.refIds;
    delete remoteNote.state;
    delete remoteNote.creationDate;
    delete remoteNote.updateDate;

    return remoteNote;
}

function convertNoteToLocal(note, state) {
    const localNote = {
        ...convertFieldsToLocal(getNoteFieldsIncludingDefaults(state), state, note),
        refIds: {
            taskunifier: note.id
        }
    };

    delete localNote.id;
    delete localNote.owner;

    return localNote;
}