import { loadObjectsFromFile, saveObjectsToFile, setObjects, addObject, updateObject, deleteObject } from './ObjectActions';

export const loadFoldersFromFile = file => {
    return loadObjectsFromFile('folders', file);
};

export const saveFoldersToFile = file => {
    return saveObjectsToFile('folders', file);
};

export const setFolders = folders => {
    return setObjects('folders', folders);
};

export const addFolder = folder => {
    return addObject('folders', folder);
};

export const updateFolder = folder => {
    return updateObject('folders', folder);
};

export const deleteFolder = folderId => {
    return deleteObject('folders', folderId);
};