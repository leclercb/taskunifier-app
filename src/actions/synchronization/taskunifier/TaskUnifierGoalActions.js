import moment from 'moment';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import { sendRequest } from 'actions/RequestActions';
import { getObjectLocalValue, getObjectRemoteValue } from 'actions/synchronization/taskunifier/TaskUnifierUtils';
import { getConfig } from 'config/Config';
import { getGoals } from 'selectors/GoalSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeGoals() {
    return async (dispatch, getState) => {
        let goals = getGoals(getState());
        const createdGoalsWithContributesTo = [];

        {
            const goalsToAdd = filterByVisibleState(goals).filter(goal => !goal.refIds.taskunifier);
            const goalsToAddPromises = goalsToAdd.map(goal => dispatch(addRemoteGoal(goal, { skipContributesTo: true })));
            const result = await Promise.all(goalsToAddPromises);

            for (let goal of result) {
                if (goal.contributesTo) {
                    createdGoalsWithContributesTo.push(goal);
                }
            }

            await dispatch(updateGoal(result, { loaded: true, skipUpdateMiddleware: true }));
        }

        goals = getGoals(getState());

        {
            const goalsToDelete = goals.filter(goal => !!goal.refIds.taskunifier && goal.state === 'TO_DELETE');
            const goalsToDeletePromises = goalsToDelete.map(goal => dispatch(deleteRemoteGoal(goal)));
            await Promise.all(goalsToDeletePromises);

            await dispatch(deleteGoal(goalsToDelete.map(goal => goal.id)));
        }

        goals = getGoals(getState());

        const goalsToAdd = [];
        const goalsToUpdate = [];
        const goalsToDelete = [];
        const remoteGoals = await dispatch(getRemoteGoals());

        for (let remoteGoal of remoteGoals) {
            const localGoal = goals.find(goal => goal.refIds.taskunifier === remoteGoal.refIds.taskunifier);

            if (!localGoal) {
                goalsToAdd.push(remoteGoal);
            } else {
                if (moment(remoteGoal.updateDate).diff(moment(localGoal.updateDate)) > 0) {
                    if (!createdGoalsWithContributesTo.find(goal => goal.id === localGoal.id)) {
                        goalsToUpdate.push(merge(localGoal, remoteGoal));
                    }
                }
            }
        }

        await dispatch(addGoal(goalsToAdd, { keepRefIds: true }));
        await dispatch(updateGoal(goalsToUpdate, { loaded: true, skipUpdateMiddleware: true }));

        goals = getGoals(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localGoal of filterByVisibleState(goals)) {
            if (!remoteGoals.find(goal => goal.refIds.taskunifier === localGoal.refIds.taskunifier)) {
                goalsToDelete.push(localGoal);
            }
        }

        await dispatch(deleteGoal(goalsToDelete.map(goal => goal.id), { force: true }));

        goals = getGoals(getState());

        {
            const goalsToUpdate = goals.filter(goal => !!goal.refIds.taskunifier && goal.state === 'TO_UPDATE');

            for (let createdGoal of createdGoalsWithContributesTo) {
                if (createdGoal.contributesTo && !!goals.find(goal => !!goal.refIds.taskunifier && goal.id === createdGoal.contributesTo)) {
                    goalsToUpdate.push(createdGoal);
                }
            }

            const goalsToUpdatePromises = goalsToUpdate.map(goal => dispatch(editRemoteGoal(goal)));
            await Promise.all(goalsToUpdatePromises);

            await dispatch(updateGoal(goalsToUpdate, { loaded: true, skipUpdateMiddleware: true }));
        }
    };
}

export function getRemoteGoals(updatedAfter) {
    logger.debug('Get remote goals');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'GET',
                url: `${getConfig().apiUrl}/v1/goals`,
                query: {
                    updatedAfter: updatedAfter ? updatedAfter.toISOString() : null
                }
            },
            settings);

        return result.data.map(goal => convertGoalToLocal(goal, state));
    };
}

export function addRemoteGoal(goal, options) {
    logger.debug('Add remote goal', goal.id, options);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'POST',
                url: `${getConfig().apiUrl}/v1/goals`,
                data: convertGoalToRemote(goal, state, options)
            },
            settings);

        return {
            ...goal,
            refIds: {
                ...goal.refIds,
                taskunifier: result.data.id
            }
        };
    };
}

export function editRemoteGoal(goal) {
    logger.debug('Edit remote goal', goal.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    Authorization: `Bearer ${settings.taskunifier.accessToken}`
                },
                method: 'PUT',
                url: `${getConfig().apiUrl}/v1/goals/${goal.refIds.taskunifier}`,
                data: convertGoalToRemote(goal, state)
            },
            settings);
    };
}

export function deleteRemoteGoal(goal) {
    logger.debug('Delete remote goal', goal.id);

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
                    url: `${getConfig().apiUrl}/v1/goals/${goal.refIds.taskunifier}`
                },
                settings);
        } catch (error) {
            // No throw exception if delete fails
            logger.debug('Delete remote goal error', error);
        }
    };
}

function convertGoalToRemote(goal, state, options) {
    options = Object.assign({
        skipContributesTo: false
    }, options);

    const remoteGoal = { ...goal };

    delete remoteGoal.id;
    delete remoteGoal.refIds;
    delete remoteGoal.state;
    delete remoteGoal.creationDate;
    delete remoteGoal.updateDate;

    if (options.skipContributesTo) {
        delete remoteGoal.contributesTo;
    } else {
        remoteGoal.contributesTo = getObjectRemoteValue(state, 'goalContributesTo', goal.contributesTo);
    }

    return remoteGoal;
}

function convertGoalToLocal(goal, state) {
    const localGoal = {
        ...goal,
        refIds: {
            taskunifier: goal.id
        },
        contributesTo: getObjectLocalValue(state, 'goalContributesTo', goal.contributesTo)
    };

    delete localGoal.id;
    delete localGoal.owner;

    return localGoal;
}