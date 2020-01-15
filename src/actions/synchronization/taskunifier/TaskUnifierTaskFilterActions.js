import moment from 'moment';
import { addTaskFilter, deleteTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import { sendRequest } from 'actions/RequestActions';
import { convertConditionToLocal, convertConditionToRemote } from 'actions/synchronization/taskunifier/TaskUnifierUtils';
import { getConfig } from 'config/Config';
import { getTaskFilters } from 'selectors/TaskFilterSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeTaskFilters() {
    return async (dispatch, getState) => {
        let taskFilters = getTaskFilters(getState());

        {
            const taskFiltersToAdd = filterByVisibleState(taskFilters).filter(taskFilter => !taskFilter.refIds.taskunifier);
            const taskFiltersToAddPromises = taskFiltersToAdd.map(taskFilter => dispatch(addRemoteTaskFilter(taskFilter)));
            const result = await Promise.all(taskFiltersToAddPromises);

            for (let taskFilter of result) {
                await dispatch(updateTaskFilter(taskFilter, { loaded: true }));
            }
        }

        taskFilters = getTaskFilters(getState());

        {
            const taskFiltersToDelete = taskFilters.filter(taskFilter => !!taskFilter.refIds.taskunifier && taskFilter.state === 'TO_DELETE');
            const taskFiltersToDeletePromises = taskFiltersToDelete.map(taskFilter => dispatch(deleteRemoteTaskFilter(taskFilter)));
            await Promise.all(taskFiltersToDeletePromises);

            for (let taskFilter of taskFiltersToDelete) {
                await dispatch(deleteTaskFilter(taskFilter.id));
            }
        }

        taskFilters = getTaskFilters(getState());

        const remoteTaskFilters = await dispatch(getRemoteTaskFilters());

        for (let remoteTaskFilter of remoteTaskFilters) {
            const localTaskFilter = taskFilters.find(taskFilter => taskFilter.refIds.taskunifier === remoteTaskFilter.refIds.taskunifier);

            if (!localTaskFilter) {
                await dispatch(addTaskFilter(remoteTaskFilter, { keepRefIds: true }));
            } else {
                if (moment(remoteTaskFilter.updateDate).diff(moment(localTaskFilter.updateDate)) > 0) {
                    await dispatch(updateTaskFilter(merge(localTaskFilter, remoteTaskFilter), { loaded: true }));
                }
            }
        }

        taskFilters = getTaskFilters(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localTaskFilter of filterByVisibleState(taskFilters)) {
            if (!remoteTaskFilters.find(taskFilter => taskFilter.refIds.taskunifier === localTaskFilter.refIds.taskunifier)) {
                await dispatch(deleteTaskFilter(localTaskFilter.id, { force: true }));
            }
        }

        taskFilters = getTaskFilters(getState());

        {
            const taskFiltersToUpdate = taskFilters.filter(taskFilter => !!taskFilter.refIds.taskunifier && taskFilter.state === 'TO_UPDATE');
            const taskFiltersToUpdatePromises = taskFiltersToUpdate.map(taskFilter => dispatch(editRemoteTaskFilter(taskFilter)));
            await Promise.all(taskFiltersToUpdatePromises);

            for (let taskFilter of taskFiltersToUpdate) {
                await dispatch(updateTaskFilter(taskFilter, { loaded: true }));
            }
        }
    };
}

export function getRemoteTaskFilters(updatedAfter) {
    console.debug('getRemoteTaskFilters');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/taskFilters`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(taskFilter => convertTaskFilterToLocal(taskFilter, state));
    };
}

export function addRemoteTaskFilter(taskFilter) {
    console.debug('addRemoteTaskFilter', taskFilter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/taskFilters`,
                data: convertTaskFilterToRemote(taskFilter, state)
            },
            settings);

        return {
            ...taskFilter,
            refIds: {
                ...taskFilter.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteTaskFilter(taskFilter) {
    console.debug('editRemoteTaskFilter', taskFilter);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/taskFilters/${taskFilter.refIds.taskunifier}`,
                data: convertTaskFilterToRemote(taskFilter, state)
            },
            settings);
    };
}

export function deleteRemoteTaskFilter(taskFilter) {
    console.debug('deleteRemoteTaskFilter', taskFilter);

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
                    url: `${getConfig().apiUrl}/v1/taskFilters/${taskFilter.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            console.debug(error);
        }
    };
}

function convertTaskFilterToRemote(taskFilter, state) {
    const remoteTaskFilter = {
        ...taskFilter,
        condition: convertConditionToRemote(taskFilter.condition, state)
    };

    delete remoteTaskFilter.id;
    delete remoteTaskFilter.refIds;
    delete remoteTaskFilter.state;
    delete remoteTaskFilter.creationDate;
    delete remoteTaskFilter.updateDate;

    return remoteTaskFilter;
}

function convertTaskFilterToLocal(taskFilter, state) {
    const localTaskFilter = {
        ...taskFilter,
        refIds: {
            taskunifier: taskFilter.id
        },
        condition: convertConditionToLocal(taskFilter.condition, state)
    };

    delete localTaskFilter.id;
    delete localTaskFilter.owner;

    return localTaskFilter;
}