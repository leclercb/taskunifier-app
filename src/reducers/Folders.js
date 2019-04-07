const Folders = (state = [], action) => {
    switch (action.type) {
        case 'SET_FOLDERS': {
            return [
                ...action.folders
            ];
        }
        case 'ADD_FOLDER': {
            const folders = [
                ...state
            ];

            const index = folders.findIndex(folder => folder.id === action.folder.id);

            if (index >= 0) {
                throw Error(`The folder with id "${action.folder.id}" cannot be added as it already exists`);
            }

            folders.push(action.folder);

            return folders;
        }
        case 'UPDATE_FOLDER': {
            const folders = [
                ...state
            ];

            const index = folders.findIndex(folder => folder.id === action.folder.id);

            if (index < 0) {
                throw Error(`The folder with id "${action.folder.id}" cannot be updated as it doesn't exist`);
            }

            folders[index] = action.folder;

            return folders;
        }
        case 'DELETE_FOLDER': {
            const folders = [
                ...state
            ];

            const folderIds = Array.isArray(action.folderId) ? action.folderId : [action.folderId];

            return folders.filter(folder => !folderIds.includes(folder.id));
        }
        default:
            return state
    }
}

export default Folders