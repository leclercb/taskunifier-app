const Synchronization = () => (state = {
    synchronizing: false,
    data: {
        taskunifier: {},
        toodledo: {}
    }
}, action) => {
    switch (action.type) {
        case 'SET_SYNCHRONIZING': {
            return {
                ...state,
                synchronizing: action.synchronizing
            };
        }
        case 'SET_SYNCHRONIZATION_DATA': {
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

export default Synchronization;