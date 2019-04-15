const Status = () => (state = {
    silent: false,
    visible: false,
    processes: [],
    notifications: []
}, action) => {
    switch (action.type) {
        case 'SET_STATUS_VISIBLE':
            return {
                ...state,
                silent: false,
                visible: action.visible,
                processes: []
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

            if (process.notify && (process.status === 'COMPLETED' || process.status === 'ERROR')) {
                newState.notifications.push({
                    ...process
                });
            }

            newState.visible = !newState.silent || !!newState.processes.find(process => process.status === 'ERROR');

            if (newState.silent && !newState.processes.find(process => process.status !== 'COMPLETED')) {
                newState.processes = [];
                newState.silent = false;
            }

            return newState;
        default:
            return state;
    }
}

export default Status;