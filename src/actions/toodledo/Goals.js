import moment from 'moment';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/toodledo/ExceptionHandler';
import { getGoals, getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeGoals() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let goals = getGoals(getState());

        {
            const goalsToAdd = filterByVisibleState(goals).filter(goal => !goal.refIds.toodledo);
            const goalsToAddPromises = goalsToAdd.map(goal => dispatch(addRemoteGoal(goal)));
            const result = await Promise.all(goalsToAddPromises);

            for (let goal of result) {
                await dispatch(updateGoal(goal, { loaded: true }));
            }
        }

        goals = getGoals(getState());

        {
            const goalsToDelete = goals.filter(goal => !!goal.refIds.toodledo && goal.state === 'TO_DELETE');
            const goalsToDeletePromises = goalsToDelete.map(goal => dispatch(deleteRemoteGoal(goal)));
            await Promise.all(goalsToDeletePromises);

            for (let goal of goalsToDelete) {
                await dispatch(deleteGoal(goal.id));
            }
        }

        goals = getGoals(getState());

        {
            const lastSync = settings.lastSynchronizationDate ? moment(settings.lastSynchronizationDate) : null;
            const lastEditGoal = moment.unix(getToodledoAccountInfo(getState()).lastedit_goal);

            if (!lastSync || lastEditGoal.diff(lastSync) > 0) {
                const remoteGoals = await dispatch(getRemoteGoals());

                for (let remoteGoal of remoteGoals) {
                    const localGoal = goals.find(goal => goal.refIds.toodledo === remoteGoal.refIds.toodledo);

                    if (!localGoal) {
                        await dispatch(addGoal(remoteGoal, { keepRefIds: true }));
                    } else {
                        await dispatch(updateGoal(merge(localGoal, remoteGoal), { loaded: true }));
                    }
                }

                goals = getGoals(getState());

                for (let localGoal of filterByVisibleState(goals)) {
                    if (!remoteGoals.find(goal => goal.refIds.toodledo === localGoal.refIds.toodledo)) {
                        await dispatch(deleteGoal(localGoal.id, { force: true }));
                    }
                }
            }
        }

        goals = getGoals(getState());

        {
            const goalsToUpdate = goals.filter(goal => !!goal.refIds.toodledo && goal.state === 'TO_UPDATE');
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
            settings,
            {
                method: 'GET',
                url: 'https://api.toodledo.com/3/goals/get.php',
                params: {
                    access_token: settings.toodledo.accessToken
                }
            });

        checkResult(result);

        return result.data.map(goal => convertGoalToTaskUnifier(goal, state));
    };
}

export function addRemoteGoal(goal) {
    console.debug('addRemoteGoal', goal);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/goals/add.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    ...convertGoalToToodledo(goal, state)
                }
            });

        checkResult(result);

        return {
            ...goal,
            refIds: {
                ...goal.refIds,
                toodledo: result.data[0].id
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
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/goals/edit.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    ...convertGoalToToodledo(goal, state)
                }
            });

        checkResult(result);
    };
}

export function deleteRemoteGoal(goal) {
    console.debug('deleteRemoteGoal', goal);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            settings,
            {
                method: 'POST',
                url: 'https://api.toodledo.com/3/goals/delete.php',
                params: {
                    access_token: settings.toodledo.accessToken,
                    id: goal.refIds.toodledo
                }
            });

        // checkResult(result);
    };
}

function convertGoalToToodledo(goal, state) {
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
        id: goal.refIds.toodledo,
        name: goal.title,
        level,
        contributes: contributesTo ? contributesTo.refIds.toodledo : 0
    };
}

function convertGoalToTaskUnifier(goal, state) {
    const goals = getGoalsFilteredByVisibleState(state);
    const contributesTo = goals.find(goal => goal.refIds.toodledo === goal.contributes);

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
            toodledo: goal.id
        },
        title: goal.name,
        level,
        contributesTo: contributesTo ? contributesTo.id : null
    };
}