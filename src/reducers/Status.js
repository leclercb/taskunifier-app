const Status = () => (state = {
    busy: false,
    processes: []
}, action) => {
    switch (action.type) {
        case 'CLEAR_PROCESSES':
            return {
                ...state,
                processes: []
            }
        case 'UPDATE_PROCESS':
            const newState = {
                ...state
            }

            let process = newState.processes.find(process => process.id === action.process.id);

            if (process) {
                Object.assign(process, action.process);
            } else {
                process = { ...action.process };
                newState.processes.push(process);
            }

            newState.busy = !!newState.processes.find(process => process.status === 'RUNNING');

            return newState;
        default:
            return state
    }
}

export default Status