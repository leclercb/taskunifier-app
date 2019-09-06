import moment from 'moment';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import { sendRequest } from 'actions/RequestActions';
import { getConfig } from 'config/Config';
import { getGoals, getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
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
                await dispatch(updateGoal(goal, { loaded: true }));

                if (goal.contributesTo) {
                    createdGoalsWithContributesTo.push(goal);
                }
            }
        }

        goals = getGoals(getState());

        {
            const goalsToDelete = goals.filter(goal => !!goal.refIds.taskunifier && goal.state === 'TO_DELETE');
            const goalsToDeletePromises = goalsToDelete.map(goal => dispatch(deleteRemoteGoal(goal)));
            await Promise.all(goalsToDeletePromises);

            for (let goal of goalsToDelete) {
                await dispatch(deleteGoal(goal.id));
            }
        }

        goals = getGoals(getState());

        const remoteGoals = await dispatch(getRemoteGoals());

        for (let remoteGoal of remoteGoals) {
            const localGoal = goals.find(goal => goal.refIds.taskunifier === remoteGoal.refIds.taskunifier);

            if (!localGoal) {
                await dispatch(addGoal(remoteGoal, { keepRefIds: true }));
            } else {
                if (moment(remoteGoal.updateDate).diff(moment(localGoal.updateDate)) > 0) {
                    if (!createdGoalsWithContributesTo.find(goal => goal.id === localGoal.id)) {
                        await dispatch(updateGoal(merge(localGoal, remoteGoal), { loaded: true }));
                    }
                }
            }
        }

        goals = getGoals(getState());

        // eslint-disable-next-line require-atomic-updates
        for (let localGoal of filterByVisibleState(goals)) {
            if (!remoteGoals.find(goal => goal.refIds.taskunifier === localGoal.refIds.taskunifier)) {
                await dispatch(deleteGoal(localGoal.id, { force: true }));
            }
        }

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

            for (let goal of goalsToUpdate) {
                await dispatch(updateGoal(goal, { loaded: true }));
            }
        }
    };
}

export function getRemoteGoals(updatedAfter) {
    console.debug('getRemoteGoals');

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
    console.debug('addRemoteGoal', goal, options);

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
    console.debug('editRemoteGoal', goal);

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
    console.debug('deleteRemoteGoal', goal);

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
            console.debug(error);
        }
    };
}

function convertGoalToRemote(goal, state, options) {
    options = merge({
        skipContributesTo: false
    }, options || {});

    const remoteGoal = { ...goal };

    delete remoteGoal.id;
    delete remoteGoal.refIds;
    delete remoteGoal.state;
    delete remoteGoal.creationDate;
    delete remoteGoal.updateDate;

    if (options.skipContributesTo) {
        delete remoteGoal.contributesTo;
    } else {
        const goals = getGoalsFilteredByVisibleState(state);
        const contributesTo = goals.find(g => g.id === goal.contributesTo);
        remoteGoal.contributesTo = contributesTo ? contributesTo.refIds.taskunifier : null;
    }

    return remoteGoal;
}

function convertGoalToLocal(goal, state) {
    const goals = getGoalsFilteredByVisibleState(state);
    const contributesTo = goals.find(g => g.refIds.taskunifier === goal.contributesTo);

    const localGoal = {
        ...goal,
        refIds: {
            taskunifier: goal.id
        },
        contributesTo: contributesTo ? contributesTo.id : null
    };

    delete localGoal.id;
    delete localGoal.owner;

    return localGoal;
}