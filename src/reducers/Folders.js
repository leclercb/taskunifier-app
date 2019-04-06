const Folders = (state = [], action) => {
    switch (action.type) {
        case 'SET_FOLDERS':
            return [
                ...action.folders
            ]
        default:
            return state
    }
}

export default Folders