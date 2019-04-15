const Status = () => (state = {
    busy: false,
    visible: false,
    processes: [],
    notifications: []
}, action) => {
    switch (action.type) {
        case 'SET_STATUS_VISIBLE': {
            return {
                ...state,
                visible: action.visible,
                processes: []
            };
        }
        case 'CLEAR_PROCESSES': {
            return {
                ...state,
                processes: []
            };
        }
        case 'UPDATE_PROCESS': {
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
                    id: action.generateNotificationId(),
                    process: {
                        ...process
                    }
                });
            }

            newState.busy = !!newState.processes.find(process => process.status === 'RUNNING')
            newState.visible = !!newState.processes.find(process => process.status === 'ERROR');

            if (!newState.processes.find(process => process.status !== 'COMPLETED')) {
                newState.processes = [];
            }

            return newState;
        }
        case 'DELETE_NOTIFICATION': {
            const notificationIds = Array.isArray(action.notificationId) ? action.notificationId : [action.notificationId];

            const newState = {
                ...state,
                notifications: state.notifications.filter(notification => !notificationIds.includes(notification.id))
            };

            return newState;
        }
        default:
            return state;
    }
}

export default Status;