const Status = () => (state = {
    visible: false,
    busy: false,
    processes: [],
    notifications: []
}, action) => {
    switch (action.type) {
        case 'SET_STATUS_VISIBLE':
            return {
                ...state,
                visible: action.visible
            }
        case 'UPDATE_PROCESS':
            const newState = {
                ...state
            }

            let process = newState.processes.find(process => process.id === action.process.id);

            if (process) {
                Object.assign(process, action.process);
            } else {
                process = {...action.process};
                newState.processes.push(process);
            }

            newState.busy = !!newState.processes.find(process => process.status === 'RUNNING');
            newState.notifications.push({...process});

            return newState;
        default:
            return state
    }
}

export default Status