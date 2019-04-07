const Tasks = (state = [], action) => {
    switch (action.type) {
        case 'SET_TASKS': {
            return [
                ...action.tasks
            ];
        }
        case 'ADD_TASK': {
            const tasks = [
                ...state
            ];

            const index = tasks.findIndex(task => task.id === action.task.id);

            if (index >= 0) {
                throw Error(`The task with id "${action.task.id}" cannot be added as it already exists`);
            }

            tasks.push(action.task);

            return tasks;
        }
        case 'UPDATE_TASK': {
            const tasks = [
                ...state
            ];

            const index = tasks.findIndex(task => task.id === action.task.id);

            if (index < 0) {
                throw Error(`The task with id "${action.task.id}" cannot be updated as it doesn't exist`);
            }

            tasks[index] = action.task;

            return tasks;
        }
        case 'DELETE_TASK': {
            const tasks = [
                ...state
            ];

            const taskIds = Array.isArray(action.taskId) ? action.taskId : [action.taskId];

            return tasks.filter(task => !taskIds.includes(task.id));
        }
        default:
            return state
    }
}

export default Tasks