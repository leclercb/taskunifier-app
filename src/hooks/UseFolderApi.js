import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFolder, deleteFolder, duplicateFolder, updateFolder } from 'actions/FolderActions';
import { getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';

export function useFolderApi() {
    const dispatch = useDispatch();
    const folders = useSelector(getFoldersFilteredByVisibleState);

    const addFolderCallback = useCallback(
        folder => dispatch(addFolder(folder)),
        [dispatch]
    );

    const duplicateFolderCallback = useCallback(
        folder => dispatch(duplicateFolder(folder)),
        [dispatch]
    );

    const updateFolderCallback = useCallback(
        folder => dispatch(updateFolder(folder)),
        [dispatch]
    );

    const deleteFolderCallback = useCallback(
        folderId => dispatch(deleteFolder(folderId)),
        [dispatch]
    );

    return {
        folders,
        addFolder: addFolderCallback,
        duplicateFolder: duplicateFolderCallback,
        updateFolder: updateFolderCallback,
        deleteFolder: deleteFolderCallback
    };
}