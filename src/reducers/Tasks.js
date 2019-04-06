const Tasks = (state = [], action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return [
                ...action.tasks
            ]
        default:
            return state
    }
}

export default Tasks