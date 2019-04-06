export const loadFolders = () => {
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
                    title: 'Folder Test 1'
                },
                {
                    id: 'folder-2',
                    title: 'Folder Test 2'
                },
                {
                    id: 'folder-3',
                    title: 'Folder Test 3'
                }
            ]
        });
    };
};