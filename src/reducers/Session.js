const Session = () => (state = {
    loading: false,
    authenticated: false,
    user: null
}, action) => {
    switch (action.type) {
        case 'SET_LOADING': {
            return {
                ...state,
                loading: action.loading
            };
        }
        case 'SET_AUTHENTICATED': {
            return {
                ...state,
                authenticated: action.authenticated
            };
        }
        case 'SET_USER': {
            return {
                ...state,
                user: action.user
            };
        }
        default:
            return state;
    }
};

export default Session;