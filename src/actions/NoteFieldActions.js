import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile,
    loadObjectsFromServer,
    saveObjectsToFile, 
    saveObjectsToServer, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadNoteFieldsFromFile(file) {
    return loadObjectsFromFile('noteFields', file);
}

export function saveNoteFieldsToFile(file, data) {
    return saveObjectsToFile('noteFields', file, data);
}

export function loadNoteFieldsFromServer() {
    return loadObjectsFromServer('noteFields');
}

export function saveNoteFieldsToServer(data) {
    return saveObjectsToServer('noteFields', data);
}

export function setNoteFields(noteFields) {
    return setObjects('noteFields', noteFields);
}

export function addNoteField(noteField, options = {}) {
    return addObject('noteFields', noteField, options);
}

export function updateNoteField(noteField, options = {}) {
    return updateObject('noteFields', noteField, options);
}

export function deleteNoteField(noteFieldId, options = {}) {
    return deleteObject('noteFields', noteFieldId, options);
}

export function cleanNoteFields() {
    return cleanObjects('noteFields');
}