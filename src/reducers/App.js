import moment from 'moment';
import { getDefaultSelectedNoteFilter } from 'data/DataNoteFilters';
import { getDefaultSelectedTaskFilter } from 'data/DataTaskFilters';

const App = () => (state = {
    dataUuid: null,
    startDate: moment().toISOString(),
    minuteTimer: moment().toISOString(),
    editingCell: {
        objectId: null,
        fieldId: null
    },
    selectedNoteIds: [],
    selectedNoteFilter: getDefaultSelectedNoteFilter(),
    selectedNoteFilterDate: moment().toISOString(),
    searchNoteValue: '',
    selectedTaskIds: [],
    selectedTaskFilter: getDefaultSelectedTaskFilter(),
    selectedTaskFilterDate: moment().toISOString(),
    searchTaskValue: '',
    joyride: {
        id: null,
        run: false
    },
    batchAddTasksManager: {
        visible: false
    },
    batchEditTasksManager: {
        visible: false
    },
    categoryManager: {
        visible: false,
        category: 'contexts',
        objectId: null
    },
    reminderManager: {
        visible: false
    },
    noteFieldManager: {
        visible: false,
        noteFieldId: null
    },
    noteFilterManager: {
        visible: false,
        noteFilterId: null
    },
    taskFieldManager: {
        visible: false,
        taskFieldId: null
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
    accountManager: {
        visible: false
    },
    settingManager: {
        visible: false,
        category: 'general'
    }
}, action) => {
    switch (action.type) {
        case 'SET_DATA_UUID':
            return {
                ...state,
                dataUuid: action.uuid
            };
        case 'SET_MINUTE_TIMER':
            return {
                ...state,
                minuteTimer: action.date
            };
        case 'SET_EDITING_CELL':
            return {
                ...state,
                editingCell: {
                    objectId: action.objectId,
                    fieldId: action.fieldId
                }
            };
        case 'SET_SELECTED_NOTE_IDS':
            return {
                ...state,
                selectedNoteIds: Array.isArray(action.noteIds) ? action.noteIds : [action.noteIds]
            };
        case 'SET_SELECTED_NOTE_FILTER':
            return {
                ...state,
                selectedNoteFilter: action.noteFilter,
                selectedNoteFilterDate: action.date
            };
        case 'SET_SEARCH_NOTE_VALUE':
            return {
                ...state,
                searchNoteValue: action.value
            };
        case 'SET_SELECTED_TASK_IDS':
            return {
                ...state,
                selectedTaskIds: Array.isArray(action.taskIds) ? action.taskIds : [action.taskIds]
            };
        case 'SET_SELECTED_TASK_FILTER':
            return {
                ...state,
                selectedTaskFilter: action.taskFilter,
                selectedTaskFilterDate: action.date
            };
        case 'SET_SEARCH_TASK_VALUE':
            return {
                ...state,
                searchTaskValue: action.value
            };
        case 'SET_JOYRIDE_OPTIONS':
            return {
                ...state,
                joyride: {
                    id: 'id' in action ? action.id : state.joyride.id,
                    run: 'run' in action ? action.run : state.joyride.run,
                    stepIndex: 'stepIndex' in action ? action.stepIndex : state.joyride.stepIndex
                }
            };
        case 'SET_BATCH_ADD_TASKS_MANAGER_OPTIONS':
            return {
                ...state,
                batchAddTasksManager: {
                    visible: 'visible' in action ? action.visible : state.batchAddTasksManager.visible
                }
            };
        case 'SET_BATCH_EDIT_TASKS_MANAGER_OPTIONS':
            return {
                ...state,
                batchEditTasksManager: {
                    visible: 'visible' in action ? action.visible : state.batchEditTasksManager.visible
                }
            };
        case 'SET_CATEGORY_MANAGER_OPTIONS':
            return {
                ...state,
                categoryManager: {
                    visible: 'visible' in action ? action.visible : state.categoryManager.visible,
                    category: 'category' in action ? action.category : state.categoryManager.category,
                    objectId: 'objectId' in action ? action.objectId : state.categoryManager.objectId
                }
            };
        case 'SET_REMINDER_MANAGER_OPTIONS':
            return {
                ...state,
                reminderManager: {
                    visible: 'visible' in action ? action.visible : state.reminderManager.visible
                }
            };
        case 'SET_NOTE_FIELD_MANAGER_OPTIONS':
            return {
                ...state,
                noteFieldManager: {
                    visible: 'visible' in action ? action.visible : state.noteFieldManager.visible,
                    noteFieldId: 'noteFieldId' in action ? action.noteFieldId : state.noteFieldManager.noteFieldId
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
        case 'SET_TASK_FIELD_MANAGER_OPTIONS':
            return {
                ...state,
                taskFieldManager: {
                    visible: 'visible' in action ? action.visible : state.taskFieldManager.visible,
                    taskFieldId: 'taskFieldId' in action ? action.taskFieldId : state.taskFieldManager.taskFieldId
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
        case 'SET_ACCOUNT_MANAGER_OPTIONS':
            return {
                ...state,
                accountManager: {
                    visible: 'visible' in action ? action.visible : state.accountManager.visible
                }
            };
        case 'SET_SETTING_MANAGER_OPTIONS':
            return {
                ...state,
                settingManager: {
                    visible: 'visible' in action ? action.visible : state.settingManager.visible,
                    category: 'category' in action ? action.category : state.settingManager.category
                }
            };
        default:
            return state;
    }
};

export default App;