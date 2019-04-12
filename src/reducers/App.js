import { getDefaultSelectedFilter } from "../data/DataFilters";

const App = () => (state = {
    user: null,
    selectedFilter: getDefaultSelectedFilter(),
    categoryManager: {
        visible: false,
        category: 'contexts',
        objectId: null
    },
    filterManager: {
        visible: false,
        filterId: null
    }
}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_FILTER':
            return {
                ...state,
                selectedFilter: action.filter
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
        case 'SET_FILTER_MANAGER_OPTIONS':
            return {
                ...state,
                filterManager: {
                    visible: 'visible' in action ? action.visible : state.filterManager.visible,
                    filterId: 'filterId' in action ? action.filterId : state.filterManager.filterId
                }
            };
        default:
            return state;
    }
}

export default App;