const Synchronization = () => (state = {
    toodledo: {}
}, action) => {
    switch (action.type) {
        case 'UPDATE_TOODLEDO_DATA': {
            return {
                ...state,
                toodledo: {
                    ...state.toodledo,
                    ...action.data
                }
            };
        }
        default:
            return state;
    }
};

export default Synchronization;