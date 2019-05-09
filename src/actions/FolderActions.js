import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadFoldersFromFile(file) {
    return loadObjectsFromFile('folders', file);
};

export function saveFoldersToFile(file, data) {
    return saveObjectsToFile('folders', file, data);
};

export function setFolders(folders) {
    return setObjects('folders', folders);
};

export function addFolder(folder) {
    return addObject('folders', folder);
};

export function updateFolder(folder) {
    return updateObject('folders', folder);
};

export function deleteFolder(folderId) {
    return deleteObject('folders', folderId);
};

export function cleanFolders() {
    return cleanObjects('folders');
};