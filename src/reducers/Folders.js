import { filterByNonArchived } from 'utils/CategoryUtils';

const Folders = () => (state = {
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
            if (action.property !== 'folders') {
                return state;
            }

            return {
                ...state,
                filteredByNonArchived: filterByNonArchived(state.all)
            };
        }
        default:
            return state;
    }
};

export default Folders;