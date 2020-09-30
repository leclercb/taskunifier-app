import moment from 'moment';
import { addTaskFilter, deleteTaskFilter, updateTaskFilter } from 'actions/TaskFilterActions';
import { sendRequest } from 'actions/RequestActions';
import { convertConditionToLocal, convertConditionToRemote } from 'actions/synchronization/taskunifier/TaskUnifierUtils';
import { getConfig } from 'config/Config';
import { getTaskFilters } from 'selectors/TaskFilterSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeTaskFilters() {
    return async (dispatch, getState) => {
        let taskFilters = getTaskFilters(getState());

        {
            const taskFiltersToAdd = filterByVisibleState(taskFilters).filter(taskFilter => !taskFilter.refIds.taskunifier);
            const taskFiltersToAddPromises = taskFiltersToAdd.map(taskFilter => dispatch(addRemoteTaskFilter(taskFilter)));
            const result = await Promise.all(taskFiltersToAddPromises);

            await dispatch(updateTaskFilter(result, { loaded: true, skipUpdateMiddleware: true }));
        }

        taskFilters = getTaskFilters(getState());

        {
            const taskFiltersToDelete = taskFilters.filter(taskFilter => !!taskFilter.refIds.taskunifier && taskFilter.state === 'TO_DELETE');
            const taskFiltersToDeletePromises = taskFiltersToDelete.map(taskFilter => dispatch(deleteRemoteTaskFilter(taskFilter)));
            await Promise.all(taskFiltersToDeletePromises);

            await dispatch(deleteTaskFilter(taskFiltersToDelete.map(taskFilter => taskFilter.id)));
        }

        taskFilters = getTaskFilters(getState());

        const taskFiltersToAdd = [];
        const taskFiltersToUpdate = [];
        const taskFiltersToDelete = [];
        const remoteTaskFilters = await dispatch(getRemoteTaskFilters());

        for (let remoteTaskFilter of remoteTaskFilters) {
            const localTaskFilter = taskFilters.find(taskFilter => taskFilter.refIds.taskunifier === remoteTaskFilter.refIds.taskunifier);

            if (!localTaskFilter) {
                taskFiltersToAdd.push(remoteTaskFilter);
            } else {
                if (moment(remoteTaskFilter.updateDate).diff(moment(localTaskFilter.updateDate)) > 0) {
                    taskFiltersToUpdate.push(merge(localTaskFilter, remoteTaskFilter));
                }
            }
        }

        await dispatch(addTaskFilter(taskFiltersToAdd, { keepRefIds: true }));
        await dispatch(updateTaskFilter(taskFiltersToUpdate, { loaded: true, skipUpdateMiddleware: true }));

        taskFilters = getTaskFilters(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localTaskFilter of filterByVisibleState(taskFilters)) {
            if (!remoteTaskFilters.find(taskFilter => taskFilter.refIds.taskunifier === localTaskFilter.refIds.taskunifier)) {
                taskFiltersToDelete.push(localTaskFilter);
            }
        }

        await dispatch(deleteTaskFilter(taskFiltersToDelete.map(taskFilter => taskFilter.id), { force: true }));

        taskFilters = getTaskFilters(getState());

        {
            const taskFiltersToUpdate = taskFilters.filter(taskFilter => !!taskFilter.refIds.taskunifier && taskFilter.state === 'TO_UPDATE');
            const taskFiltersToUpdatePromises = taskFiltersToUpdate.map(taskFilter => dispatch(editRemoteTaskFilter(taskFilter)));
            await Promise.all(taskFiltersToUpdatePromises);

            await dispatch(updateTaskFilter(taskFiltersToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteTaskFilters(updatedAfter) {
    logger.debug('Get remote task filters');

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
    logger.debug('Add remote task filter', taskFilter.id);

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
    logger.debug('Edit remote task filter', taskFilter.id);

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
    logger.debug('Delete remote task filter', taskFilter.id);

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
            logger.debug('Delete remote task filter error', error);
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