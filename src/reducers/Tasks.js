import { getDefaultSelectedTaskFilter } from 'data/DataTaskFilters';
import { deleteTag, updateTag } from 'utils/TagUtils';

const Tasks = () => (state = {
    all: [],
    selectedTaskIds: [],
    selectedTaskFilter: getDefaultSelectedTaskFilter(),
    selectedTaskFilterDate: null
}, action) => {
    switch (action.type) {
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
                all: newObjects
            };

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
                all: newObjects
            };

            return newState;
        }
        default:
            return state;
    }
};

export default Tasks;