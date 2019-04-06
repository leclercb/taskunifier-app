const App = (state = {
    user: null,
    selectedFilter: {
        id: 'not-completed',
        title: 'Not Completed'
    }
}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_FILTER':
            return {
                ...state,
                selectedFilter: action.filter
            }
        default:
            return state
    }
}

export default App