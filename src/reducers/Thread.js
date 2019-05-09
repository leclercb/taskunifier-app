const Thread = () => (state = {
    busy: false,
    visible: false,
    processes: [],
    notifications: []
}, action) => {
    switch (action.type) {
        case 'SET_THREAD_MANAGER_VISIBLE': {
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

            if (process.notify && (process.state === 'COMPLETED' || process.state === 'ERROR')) {
                newState.notifications.push({
                    id: action.generateNotificationId(),
                    process: {
                        ...process
                    }
                });
            }

            newState.busy = !!newState.processes.find(process => process.state === 'RUNNING');
            newState.visible = !!newState.processes.find(process => process.state === 'ERROR');

            if (!newState.processes.find(process => process.state !== 'COMPLETED')) {
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
};

export default Thread;