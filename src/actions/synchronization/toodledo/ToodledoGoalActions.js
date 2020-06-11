import moment from 'moment';
import qs from 'qs';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import { sendRequest } from 'actions/RequestActions';
import { checkResult } from 'actions/synchronization/toodledo/ExceptionHandler';
import { getObjectLocalValue, getObjectRemoteValue } from 'actions/synchronization/toodledo/ToodledoUtils';
import { getGoals } from 'selectors/GoalSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getToodledoAccountInfo } from 'selectors/SynchronizationSelectors';
import { filterByVisibleState } from 'utils/CategoryUtils';
import logger from 'utils/LogUtils';
import { merge } from 'utils/ObjectUtils';

export function synchronizeGoals() {
    return async (dispatch, getState) => {
        const settings = getSettings(getState());

        let goals = getGoals(getState());
        const createdGoalsWithContributesTo = [];

        {
            const goalsToAdd = filterByVisibleState(goals).filter(goal => !goal.refIds.toodledo);
            const goalsToAddPromises = goalsToAdd.map(goal => dispatch(addRemoteGoal(goal, { skipContributesTo: true })));
            const result = await Promise.all(goalsToAddPromises);

            for (let goal of result) {
                await dispatch(updateGoal(goal, { loaded: true, skipUpdateMiddleware: true }));

                if (goal.contributesTo) {
                    createdGoalsWithContributesTo.push(goal);
                }
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
                        if (!createdGoalsWithContributesTo.find(goal => goal.id === localGoal.id)) {
                            await dispatch(updateGoal(merge(localGoal, remoteGoal), { loaded: true, skipUpdateMiddleware: true }));
                        }
                    }
                }

                goals = getGoals(getState());

                // eslint-disable-next-line require-atomic-updates
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

            for (let createdGoal of createdGoalsWithContributesTo) {
                if (createdGoal.contributesTo && !!goals.find(goal => !!goal.refIds.toodledo && goal.id === createdGoal.contributesTo)) {
                    goalsToUpdate.push(createdGoal);
                }
            }

            const goalsToUpdatePromises = goalsToUpdate.map(goal => dispatch(editRemoteGoal(goal)));
            await Promise.all(goalsToUpdatePromises);

            for (let goal of goalsToUpdate) {
                await dispatch(updateGoal(goal, { loaded: true, skipUpdateMiddleware: true }));
            }
        }
    };
}

export function getRemoteGoals() {
    logger.debug('Get remote goals');

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/goals/get.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken
                })
            },
            settings);

        checkResult(result);

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
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/goals/add.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    ...convertGoalToRemote(goal, state, options)
                })
            },
            settings);

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
    logger.debug('Edit remote goal', goal.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const result = await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/goals/edit.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    ...convertGoalToRemote(goal, state)
                })
            },
            settings);

        checkResult(result);
    };
}

export function deleteRemoteGoal(goal) {
    logger.debug('Delete remote goal', goal.id);

    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await sendRequest(
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: 'https://api.toodledo.com/3/goals/delete.php',
                data: qs.stringify({
                    access_token: settings.toodledo.accessToken,
                    id: goal.refIds.toodledo
                })
            },
            settings);

        // checkResult(result);
    };
}

function convertGoalToRemote(goal, state, options) {
    options = Object.assign({
        skipContributesTo: false
    }, options);

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
        contributes: !options.skipContributesTo ? getObjectRemoteValue(state, 'goalContributesTo', goal.contributesTo) : 0
    };
}

function convertGoalToLocal(goal, state) {
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
        contributesTo: getObjectLocalValue(state, 'goalContributesTo', goal.contributes)
    };
}