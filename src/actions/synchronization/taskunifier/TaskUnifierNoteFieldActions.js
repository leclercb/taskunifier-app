import moment from 'moment';
import { addNoteField, deleteNoteField, updateNoteField } from 'actions/NoteFieldActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getNoteFields } from 'selectors/NoteFieldSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeNoteFields() {
    return async (dispatch, getState) => {
        let noteFields = getNoteFields(getState());

        {
            const noteFieldsToAdd = filterByVisibleState(noteFields).filter(noteField => !noteField.refIds.taskunifier);
            const noteFieldsToAddPromises = noteFieldsToAdd.map(noteField => dispatch(addRemoteNoteField(noteField)));
            const result = await Promise.all(noteFieldsToAddPromises);

            for (let noteField of result) {
                await dispatch(updateNoteField(noteField, { loaded: true }));
            }
        }

        noteFields = getNoteFields(getState());

        {
            const noteFieldsToDelete = noteFields.filter(noteField => !!noteField.refIds.taskunifier && noteField.state === 'TO_DELETE');
            const noteFieldsToDeletePromises = noteFieldsToDelete.map(noteField => dispatch(deleteRemoteNoteField(noteField)));
            await Promise.all(noteFieldsToDeletePromises);

            for (let noteField of noteFieldsToDelete) {
                await dispatch(deleteNoteField(noteField.id));
            }
        }

        noteFields = getNoteFields(getState());

        const remoteNoteFields = await dispatch(getRemoteNoteFields());

        for (let remoteNoteField of remoteNoteFields) {
            const localNoteField = noteFields.find(noteField => noteField.refIds.taskunifier === remoteNoteField.refIds.taskunifier);

            if (!localNoteField) {
                await dispatch(addNoteField(remoteNoteField, { keepRefIds: true }));
            } else {
                if (moment(remoteNoteField.updateDate).diff(moment(localNoteField.updateDate)) > 0) {
                    await dispatch(updateNoteField(merge(localNoteField, remoteNoteField), { loaded: true }));
                }
            }
        }

        noteFields = getNoteFields(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localNoteField of filterByVisibleState(noteFields)) {
            if (!remoteNoteFields.find(noteField => noteField.refIds.taskunifier === localNoteField.refIds.taskunifier)) {
                await dispatch(deleteNoteField(localNoteField.id, { force: true }));
            }
        }

        noteFields = getNoteFields(getState());

        {
            const noteFieldsToUpdate = noteFields.filter(noteField => !!noteField.refIds.taskunifier && noteField.state === 'TO_UPDATE');
            const noteFieldsToUpdatePromises = noteFieldsToUpdate.map(noteField => dispatch(editRemoteNoteField(noteField)));
            await Promise.all(noteFieldsToUpdatePromises);

            for (let noteField of noteFieldsToUpdate) {
                await dispatch(updateNoteField(noteField, { loaded: true }));
            }
        }
    };
}

export function getRemoteNoteFields(updatedAfter) {
    console.debug('getRemoteNoteFields');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/noteFields`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(noteField => convertNoteFieldToLocal(noteField));
    };
}

export function addRemoteNoteField(noteField) {
    console.debug('addRemoteNoteField', noteField);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/noteFields`,
                data: convertNoteFieldToRemote(noteField)
            },
            settings);

        return {
            ...noteField,
            refIds: {
                ...noteField.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteNoteField(noteField) {
    console.debug('editRemoteNoteField', noteField);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/noteFields/${noteField.refIds.taskunifier}`,
                data: convertNoteFieldToRemote(noteField)
            },
            settings);
    };
}

export function deleteRemoteNoteField(noteField) {
    console.debug('deleteRemoteNoteField', noteField);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        try {
            await sendRequest(
                {
                    headers: {
                        Authorization: `Bearer ${settings.taskunifier.accessToken}`
                    },
                    method: 'DELETE',
                    url: `${getConfig().apiUrl}/v1/noteFields/${noteField.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            console.debug(error);
        }
    };
}

function convertNoteFieldToRemote(noteField) {
    const remoteNoteField = { ...noteField };

    delete remoteNoteField.id;
    delete remoteNoteField.refIds;
    delete remoteNoteField.state;
    delete remoteNoteField.creationDate;
    delete remoteNoteField.updateDate;

    return remoteNoteField;
}

function convertNoteFieldToLocal(noteField) {
    const localNoteField = {
        ...noteField,
        refIds: {
            taskunifier: noteField.id
        }
    };

    delete localNoteField.id;
    delete localNoteField.owner;

    return localNoteField;
}