const App = () => (state = {
    user: null,
    selectedFilter: {
        id: 'not-completed',
        title: 'Not Completed'
    },
    categoryManagerVisible: false
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
                categoryManagerVisible: action.visible
            }
        default:
            return state
    }
}

export default App