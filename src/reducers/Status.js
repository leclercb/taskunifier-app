const Status = context => (state = {
    id: null,
    loaded: false,
    loading: false
}, action) => {
    if (context !== action.context) {
        return state;
    }

    switch (action.type) {
        case 'ON_LOAD':
            return {
                ...state,
                id: action.id,
                loaded: false,
                loading: true
            }
        case 'ON_SUCCESS':
            return {
                ...state,
                id: action.id,
                loaded: true,
                loading: false
            }
        default:
            return state
    }
}

export default Status