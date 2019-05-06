import moment from 'moment';
import { getDefaultTaskFields } from 'data/DataTaskFields';
import { getDefaultSelectedTaskFilter } from 'data/DataTaskFilters';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { applyFilter } from 'utils/FilterUtils';
import { deleteTag, updateTag } from 'utils/TagUtils';

const getFilteredTasks = (state, action) => {
    const fields = getDefaultTaskFields(action.settings).concat(filterByVisibleState(action.taskFields.all));

    return state.filteredByVisibleState.filter(task => {
        if (!state.selectedTaskFilterDate ||
            moment(task.creationDate).isAfter(moment(state.selectedTaskFilterDate))) {
            return true;
        }

        return applyFilter(state.selectedTaskFilter, task, fields);
    });
};

const Tasks = () => (state = {
    all: [],
    filteredByVisibleState: [],
    filteredBySelectedFilter: [],
    selectedTaskIds: [],
    selectedTaskFilter: getDefaultSelectedTaskFilter(),
    selectedTaskFilterDate: null
}, action) => {
    switch (action.type) {
        case 'SET_OBJECTS':
        case 'ADD_OBJECT':
        case 'UPDATE_OBJECT':
        case 'UPDATE_HIERARCHY':
        case 'DELETE_OBJECT':
        case 'CLEAN_OBJECTS': {
            if (action.property !== 'tasks') {
                return state;
            }

            return {
                ...state,
                filteredBySelectedFilter: getFilteredTasks(state, action)
            };
        }
        case 'SET_SELECTED_TASK_IDS': {
            return {
                ...state,
                selectedTaskIds: action.taskIds
            };
        }
        case 'SET_SELECTED_TASK_FILTER': {
            const newState = {
                ...state,
                selectedTaskFilter: action.taskFilter,
                selectedTaskFilterDate: action.date
            };

            newState.filteredBySelectedFilter = getFilteredTasks(newState, action);

            return newState;
        }
        case 'UPDATE_TAG': {
            const newObjects = state.all.map(task => {
                if (task.state === 'LOADED' || task.state === 'TO_UPDATE') {
                    task = { ...task };
                    updateTag(task, action.tag.id, action.tag.title);
                    task.updateDate = action.updateDate;
                    task.state = 'TO_UPDATE';
                }

                return task;
            });

            const newState = {
                ...state,
                all: newObjects,
                filteredByVisibleState: filterByVisibleState(newObjects)
            };

            newState.filteredBySelectedFilter = getFilteredTasks(newState, action);

            return newState;
        }
        case 'DELETE_TAG': {
            const newObjects = state.all.map(task => {
                if (task.state === 'LOADED' || task.state === 'TO_UPDATE') {
                    task = { ...task };
                    deleteTag(task, action.tagId);
                    task.updateDate = action.updateDate;
                    task.state = 'TO_UPDATE';
                }

                return task;
            });

            const newState = {
                ...state,
                all: newObjects,
                filteredByVisibleState: filterByVisibleState(newObjects)
            };

            newState.filteredBySelectedFilter = getFilteredTasks(newState, action);

            return newState;
        }
        default:
            return state;
    }
};

export default Tasks;