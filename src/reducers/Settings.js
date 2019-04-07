const Settings = () => (state = {
    visible: false,
    data: {}
}, action) => {
    switch (action.type) {
        case 'SET_SETTINGS_VISIBLE':
            return {
                ...state,
                visible: action.visible
            }
        case 'SET_SETTINGS': {
            return {
                ...state,
                data: action.settings
            };
        }
        case 'UPDATE_SETTINGS': {
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.settings
                }
            }
        }
        default:
            return state
    }
}

export default Settings