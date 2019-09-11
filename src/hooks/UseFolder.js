import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleFolderSelector } from 'selectors/FolderSelectors';

export function useFolder(folderId) {
    const getVisibleFolder = useMemo(getVisibleFolderSelector, []);
    const folder = useSelector(state => getVisibleFolder(state, folderId));
    return folder;
}