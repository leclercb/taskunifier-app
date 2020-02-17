const Publication = () => (state = {
    publishing: false,
    data: {
        googlecal: {}
    }
}, action) => {
    switch (action.type) {
        case 'SET_PUBLISHING': {
            return {
                ...state,
                publishing: action.publishing
            };
        }
        case 'SET_PUBLICATION_DATA': {
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.application]: action.data
                }
            };
        }
        default:
            return state;
    }
};

export default Publication;