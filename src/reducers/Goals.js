import { filterArchivedObjects } from 'utils/CategoryUtils';

const Goals = () => (state = {
    all: [],
    filteredByVisibleState: [],
    filteredByNonArchived: []
}, action) => {
    switch (action.type) {
        case 'SET_OBJECTS':
        case 'ADD_OBJECT':
        case 'UPDATE_OBJECT':
        case 'UPDATE_HIERARCHY':
        case 'DELETE_OBJECT':
        case 'CLEAN_OBJECTS': {
            if (action.property !== 'goals') {
                return state;
            }

            return {
                ...state,
                filteredByNonArchived: filterArchivedObjects(state.all)
            };
        }
        default:
            return state;
    }
};

export default Goals;