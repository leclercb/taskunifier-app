export const loadTasks = () => {
    return dispatch => {
        dispatch({
            type: 'ON_SUCCESS',
            context: 'TASKS',
            id: 'a'
        });

        dispatch({
            type: 'SET_TASKS',
            tasks: [
                {
                    id: 'task-1',
                    title: 'Task Test 1',
                    completed: false
                },
                {
                    id: 'task-2',
                    title: 'Task Test 2',
                    completed: true
                },
                {
                    id: 'task-3',
                    title: 'Task Test 3',
                    completed: false
                }
            ]
        });
    };
};