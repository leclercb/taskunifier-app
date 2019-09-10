import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    duplicateObject,
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile,
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadFoldersFromFile(file) {
    return loadObjectsFromFile('folders', file);
}

export function saveFoldersToFile(file, data) {
    return saveObjectsToFile('folders', file, data);
}

export function loadFoldersFromServer() {
    return loadObjectsFromServer('folders');
}

export function setFolders(folders) {
    return setObjects('folders', folders);
}

export function addFolder(folder, options = {}) {
    return addObject('folders', folder, options);
}

export function duplicateFolder(folder, options = {}) {
    return duplicateObject('folders', folder, options);
}

export function updateFolder(folder, options = {}) {
    return updateObject('folders', folder, options);
}

export function deleteFolder(folderId, options = {}) {
    return deleteObject('folders', folderId, options);
}

export function cleanFolders() {
    return cleanObjects('folders');
}