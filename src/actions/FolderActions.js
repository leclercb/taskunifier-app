import { 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    addObject, 
    updateObject, 
    deleteObject, 
    cleanObjects 
} from './ObjectActions';

export const loadFoldersFromFile = file => {
    return loadObjectsFromFile('folders', file);
};

export const saveFoldersToFile = (file, data) => {
    return saveObjectsToFile('folders', file, data);
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

export const cleanFolders = () => {
    return cleanObjects('folders');
};