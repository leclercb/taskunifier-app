import moment from 'moment';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/taskunifier/ExceptionHandler';
import { getGoals, getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTaskUnifierAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeGoals() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let goals = getGoals(getState());

        {
            const goalsToAdd = filterByVisibleState(goals).filter(goal => !goal.refIds.taskunifier);
            const goalsToAddPromises = goalsToAdd.map(goal => dispatch(addRemoteGoal(goal)));
            const result = await Promise.all(goalsToAddPromises);

            for (let goal of result) {
                await dispatch(updateGoal(goal, { loaded: true }));
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

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditGoal = moment.unix(getTaskUnifierAccountInfo(getState()).lastedit_goal);

            if (!lastSync || lastEditGoal.diff(lastSync) > 0) {
                const remoteGoals = await dispatch(getRemoteGoals());

                for (let remoteGoal of remoteGoals) {
                    const localGoal = goals.find(goal => goal.refIds.taskunifier === remoteGoal.refIds.taskunifier);

                    if (!localGoal) {
                        await dispatch(addGoal(remoteGoal, { keepRefIds: true }));
                    } else {
                        await dispatch(updateGoal(merge(localGoal, remoteGoal), { loaded: true }));
                    }
                }

                goals = getGoals(getState());

                for (let localGoal of filterByVisibleState(goals)) {
                    if (!remoteGoals.find(goal => goal.refIds.taskunifier === localGoal.refIds.taskunifier)) {
                        await dispatch(deleteGoal(localGoal.id, { force: true }));
                    }
                }
            }
        }

        goals = getGoals(getState());

        {
            const goalsToUpdate = goals.filter(goal => !!goal.refIds.taskunifier && goal.state === 'TO_UPDATE');
            const goalsToUpdatePromises = goalsToUpdate.map(goal => dispatch(editRemoteGoal(goal)));
            await Promise.all(goalsToUpdatePromises);

            for (let goal of goalsToUpdate) {
                await dispatch(updateGoal(goal, { loaded: true }));
            }
        }
    };
}

export function getRemoteGoals() {
    console.debug('getRemoteGoals');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                method: 'GET',
                url: 'https://api.taskunifier.com/3/goals/get.php',
                params: {
                    access_token: settings.taskunifier.accessToken
                }
            },
            settings);

        checkResult(result);

        return result.data.map(goal => convertGoalToLocal(goal, state));
    };
}

export function addRemoteGoal(goal) {
    console.debug('addRemoteGoal', goal);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                method: 'POST',
                url: 'https://api.taskunifier.com/3/goals/add.php',
                params: {
                    access_token: settings.taskunifier.accessToken,
                    ...convertGoalToRemote(goal, state)
                }
            },
            settings);

        checkResult(result);

        return {
            ...goal,
            refIds: {
                ...goal.refIds,
                taskunifier: result.data[0].id
            }
        };
    };
}

export function editRemoteGoal(goal) {
    console.debug('editRemoteGoal', goal);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                method: 'POST',
                url: 'https://api.taskunifier.com/3/goals/edit.php',
                params: {
                    access_token: settings.taskunifier.accessToken,
                    ...convertGoalToRemote(goal, state)
                }
            },
            settings);

        checkResult(result);
    };
}

export function deleteRemoteGoal(goal) {
    console.debug('deleteRemoteGoal', goal);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                method: 'POST',
                url: 'https://api.taskunifier.com/3/goals/delete.php',
                params: {
                    access_token: settings.taskunifier.accessToken,
                    id: goal.refIds.taskunifier
                }
            },
            settings);

        // checkResult(result);
    };
}

function convertGoalToRemote(goal, state) {
    const goals = getGoalsFilteredByVisibleState(state);
    const contributesTo = goals.find(goal => goal.id === goal.contributesTo);

    let level;

    switch (goal.level) {
        case 'shortTerm':
            level = 2;
            break;
        case 'longTerm':
            level = 1;
            break;
        case 'lifeTime':
        default:
            level = 0;
            break;
    }

    return {
        id: goal.refIds.taskunifier,
        name: goal.title,
        level,
        contributes: contributesTo ? contributesTo.refIds.taskunifier : 0
    };
}

function convertGoalToLocal(goal, state) {
    const goals = getGoalsFilteredByVisibleState(state);
    const contributesTo = goals.find(goal => goal.refIds.taskunifier === goal.contributes);

    let level;

    switch (goal.level) {
        case 2:
            level = 'shortTerm';
            break;
        case 1:
            level = 'longTerm';
            break;
        case 0:
        default:
            level = 'lifeTime';
            break;
    }

    return {
        refIds: {
            taskunifier: goal.id
        },
        title: goal.name,
        level,
        contributesTo: contributesTo ? contributesTo.id : null
    };
}