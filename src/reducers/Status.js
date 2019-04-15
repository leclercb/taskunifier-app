const Status = () => (state = {
    silent: false,
    visible: false,
    processes: []
}, action) => {
    switch (action.type) {
        case 'SET_STATUS_VISIBLE':
            return {
                ...state,
                visible: action.visible
            };
        case 'SET_SILENT':
            return {
                ...state,
                silent: action.silent
            };
        case 'CLEAR_PROCESSES':
            return {
                ...state,
                processes: []
            };
        case 'UPDATE_PROCESS':
            const newState = {
                ...state
            };

            let process = newState.processes.find(process => process.id === action.process.id);

            if (process) {
                Object.assign(process, action.process);
            } else {
                process = { ...action.process };
                newState.processes.push(process);
            }

            newState.visible = !!newState.processes.find(process => process.status !== 'COMPLETED');

            return newState;
        default:
            return state;
    }
}

export default Status;