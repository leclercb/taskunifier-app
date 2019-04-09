const App = () => (state = {
    user: null,
    selectedFilter: {
        id: 'not-completed',
        title: 'Not Completed'
    },
    categoryManager: {
        visible: false,
        category: 'contexts',
        objectId: null
    }
}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_FILTER':
            return {
                ...state,
                selectedFilter: action.filter
            }
        case 'SET_CATEGORY_MANAGER_VISIBLE':
            return {
                ...state,
                categoryManager: {
                    visible: 'visible' in action ? action.visible : state.categoryManager.visible,
                    category: 'category' in action ? action.category : state.categoryManager.category,
                    objectId: 'objectId' in action ? action.objectId : state.categoryManager.objectId
                }
            }
        default:
            return state
    }
}

export default App