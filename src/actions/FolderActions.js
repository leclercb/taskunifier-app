export const setFolders = () => {
    return dispatch => {
        dispatch({
            type: 'ON_SUCCESS',
            context: 'FOLDERS',
            id: 'a'
        });

        dispatch({
            type: 'SET_FOLDERS',
            folders: [
                {
                    id: 'folder-1',
                    title: 'Folder Test 1',
                    color: '#33cc33'
                },
                {
                    id: 'folder-2',
                    title: 'Folder Test 2',
                    color: '#ff9933'
                },
                {
                    id: 'folder-3',
                    title: 'Folder Test 3',
                    color: '#ff66ff'
                }
            ]
        });
    };
};

export const addFolder = folder => {
    return dispatch => {
        dispatch({
            type: 'ADD_FOLDER',
            folder: folder
        });
    };
};

export const updateFolder = folder => {
    return dispatch => {
        dispatch({
            type: 'UPDATE_FOLDER',
            folder: folder
        });
    };
};

export const deleteFolder = folderId => {
    return dispatch => {
        dispatch({
            type: 'DELETE_FOLDER',
            folderId: folderId
        });
    };
};