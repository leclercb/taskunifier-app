import moment from 'moment';
import { addNoteFilter, deleteNoteFilter, updateNoteFilter } from 'actions/NoteFilterActions';
import { sendRequest } from 'actions/RequestActions';
import { convertConditionToLocal, convertConditionToRemote } from 'actions/synchronization/taskunifier/TaskUnifierUtils';
import { getConfig } from 'config/Config';
import { getNoteFilters } from 'selectors/NoteFilterSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeNoteFilters() {
    return async (dispatch, getState) => {
        let noteFilters = getNoteFilters(getState());

        {
            const noteFiltersToAdd = filterByVisibleState(noteFilters).filter(noteFilter => !noteFilter.refIds.taskunifier);
            const noteFiltersToAddPromises = noteFiltersToAdd.map(noteFilter => dispatch(addRemoteNoteFilter(noteFilter)));
            const result = await Promise.all(noteFiltersToAddPromises);

            for (let noteFilter of result) {
                await dispatch(updateNoteFilter(noteFilter, { loaded: true }));
            }
        }

        noteFilters = getNoteFilters(getState());

        {
            const noteFiltersToDelete = noteFilters.filter(noteFilter => !!noteFilter.refIds.taskunifier && noteFilter.state === 'TO_DELETE');
            const noteFiltersToDeletePromises = noteFiltersToDelete.map(noteFilter => dispatch(deleteRemoteNoteFilter(noteFilter)));
            await Promise.all(noteFiltersToDeletePromises);

            for (let noteFilter of noteFiltersToDelete) {
                await dispatch(deleteNoteFilter(noteFilter.id));
            }
        }

        noteFilters = getNoteFilters(getState());

        const remoteNoteFilters = await dispatch(getRemoteNoteFilters());

        for (let remoteNoteFilter of remoteNoteFilters) {
            const localNoteFilter = noteFilters.find(noteFilter => noteFilter.refIds.taskunifier === remoteNoteFilter.refIds.taskunifier);

            if (!localNoteFilter) {
                await dispatch(addNoteFilter(remoteNoteFilter, { keepRefIds: true }));
            } else {
                if (moment(remoteNoteFilter.updateDate).diff(moment(localNoteFilter.updateDate)) > 0) {
                    await dispatch(updateNoteFilter(merge(localNoteFilter, remoteNoteFilter), { loaded: true }));
                }
            }
        }

        noteFilters = getNoteFilters(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localNoteFilter of filterByVisibleState(noteFilters)) {
            if (!remoteNoteFilters.find(noteFilter => noteFilter.refIds.taskunifier === localNoteFilter.refIds.taskunifier)) {
                await dispatch(deleteNoteFilter(localNoteFilter.id, { force: true }));
            }
        }

        noteFilters = getNoteFilters(getState());

        {
            const noteFiltersToUpdate = noteFilters.filter(noteFilter => !!noteFilter.refIds.taskunifier && noteFilter.state === 'TO_UPDATE');
            const noteFiltersToUpdatePromises = noteFiltersToUpdate.map(noteFilter => dispatch(editRemoteNoteFilter(noteFilter)));
            await Promise.all(noteFiltersToUpdatePromises);

            for (let noteFilter of noteFiltersToUpdate) {
                await dispatch(updateNoteFilter(noteFilter, { loaded: true }));
            }
        }
    };
}

export function getRemoteNoteFilters(updatedAfter) {
    console.debug('getRemoteNoteFilters');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/noteFilters`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(noteFilter => convertNoteFilterToLocal(noteFilter, state));
    };
}

export function addRemoteNoteFilter(noteFilter) {
    console.debug('addRemoteNoteFilter', noteFilter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/noteFilters`,
                data: convertNoteFilterToRemote(noteFilter, state)
            },
            settings);

        return {
            ...noteFilter,
            refIds: {
                ...noteFilter.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteNoteFilter(noteFilter) {
    console.debug('editRemoteNoteFilter', noteFilter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/noteFilters/${noteFilter.refIds.taskunifier}`,
                data: convertNoteFilterToRemote(noteFilter, state)
            },
            settings);
    };
}

export function deleteRemoteNoteFilter(noteFilter) {
    console.debug('deleteRemoteNoteFilter', noteFilter);

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
                    url: `${getConfig().apiUrl}/v1/noteFilters/${noteFilter.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            console.debug(error);
        }
    };
}

function convertNoteFilterToRemote(noteFilter, state) {
    const remoteNoteFilter = {
        ...noteFilter,
        condition: convertConditionToRemote(noteFilter.condition, state)
    };

    delete remoteNoteFilter.id;
    delete remoteNoteFilter.refIds;
    delete remoteNoteFilter.state;
    delete remoteNoteFilter.creationDate;
    delete remoteNoteFilter.updateDate;

    return remoteNoteFilter;
}

function convertNoteFilterToLocal(noteFilter, state) {
    const localNoteFilter = {
        ...noteFilter,
        refIds: {
            taskunifier: noteFilter.id
        },
        condition: convertConditionToLocal(noteFilter.condition, state)
    };

    delete localNoteFilter.id;
    delete localNoteFilter.owner;

    return localNoteFilter;
}