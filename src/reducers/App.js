const App = () => (state = {
    user: null,
    selectedFilter: {
        id: 'not-completed',
        title: 'Not Completed'
    },
    manageCategoriesVisible: false
}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_FILTER':
            return {
                ...state,
                selectedFilter: action.filter
            }
        case 'SET_MANAGE_CATEGORIES_VISIBLE':
            return {
                ...state,
                manageCategoriesVisible: action.visible
            }
        default:
            return state
    }
}

export default App