const Status = () => (state = {
    busy: false,
    processes: [],
    notifications: []
}, action) => {
    switch (action.type) {
        case 'UPDATE_PROCESS':
            const newState = {
                ...state
            }

            //if (action.id in newState.processes) {
                newState.processes[action.id] = {
                    ...newState.processes[action.id],
                    ...action
                };
            //} else {
                //newState.processes[action.id] = action;
            //}

            newState.busy = !!Object.keys(newState.processes).find(key => newState.processes[key].status === 'RUNNING');
            newState.notifications.push(action.status + ': ' + newState.processes[action.id].title);

            return newState;
        default:
            return state
    }
}

export default Status