import { getDefaultSelectedNoteFilter } from 'data/DataNoteFilters';
import { getDefaultSelectedTaskFilter } from 'data/DataTaskFilters';

const App = () => (state = {
    selectedView: 'task',
    selectedNoteIds: [],
    selectedNoteFilter: getDefaultSelectedNoteFilter(),
    selectedNoteFilterDate: null,
    selectedTaskIds: [],
    selectedTaskFilter: getDefaultSelectedTaskFilter(),
    selectedTaskFilterDate: null,
    categoryManager: {
        visible: false,
        category: 'contexts',
        objectId: null
    },
    noteFilterManager: {
        visible: false,
        noteFilterId: null
    },
    taskFilterManager: {
        visible: false,
        taskFilterId: null
    },
    taskEditionManager: {
        visible: false,
        taskId: null
    },
    taskTemplateManager: {
        visible: false,
        taskTemplateId: null
    },
    settingManager: {
        visible: false
    },
    batchAddTasksManager: {
        visible: false
    }
}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_VIEW':
            return {
                ...state,
                selectedView: action.view
            };
        case 'SET_SELECTED_NOTE_IDS': {
            return {
                ...state,
                selectedNoteIds: action.noteIds
            };
        }
        case 'SET_SELECTED_NOTE_FILTER': {
            const newState = {
                ...state,
                selectedNoteFilter: action.noteFilter,
                selectedNoteFilterDate: action.date
            };

            return newState;
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

            return newState;
        }
        case 'SET_CATEGORY_MANAGER_OPTIONS':
            return {
                ...state,
                categoryManager: {
                    visible: 'visible' in action ? action.visible : state.categoryManager.visible,
                    category: 'category' in action ? action.category : state.categoryManager.category,
                    objectId: 'objectId' in action ? action.objectId : state.categoryManager.objectId
                }
            };
        case 'SET_NOTE_FILTER_MANAGER_OPTIONS':
            return {
                ...state,
                noteFilterManager: {
                    visible: 'visible' in action ? action.visible : state.noteFilterManager.visible,
                    noteFilterId: 'noteFilterId' in action ? action.noteFilterId : state.noteFilterManager.noteFilterId
                }
            };
        case 'SET_TASK_FILTER_MANAGER_OPTIONS':
            return {
                ...state,
                taskFilterManager: {
                    visible: 'visible' in action ? action.visible : state.taskFilterManager.visible,
                    taskFilterId: 'taskFilterId' in action ? action.taskFilterId : state.taskFilterManager.taskFilterId
                }
            };
        case 'SET_TASK_EDITION_MANAGER_OPTIONS':
            return {
                ...state,
                taskEditionManager: {
                    visible: 'visible' in action ? action.visible : state.taskEditionManager.visible,
                    taskId: 'taskId' in action ? action.taskId : state.taskEditionManager.taskId
                }
            };
        case 'SET_TASK_TEMPLATE_MANAGER_OPTIONS':
            return {
                ...state,
                taskTemplateManager: {
                    visible: 'visible' in action ? action.visible : state.taskTemplateManager.visible,
                    taskTemplateId: 'taskTemplateId' in action ? action.taskTemplateId : state.taskTemplateManager.taskTemplateId
                }
            };
        case 'SET_SETTING_MANAGER_OPTIONS':
            return {
                ...state,
                settingManager: {
                    visible: 'visible' in action ? action.visible : state.settingManager.visible
                }
            };
        case 'SET_BATCH_ADD_TASKS_MANAGER_OPTIONS':
            return {
                ...state,
                batchAddTasksManager: {
                    visible: 'visible' in action ? action.visible : state.batchAddTasksManager.visible
                }
            };
        default:
            return state;
    }
};

export default App;