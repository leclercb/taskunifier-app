import { 
    addObject, 
    cleanObjects, 
    deleteObject, 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    updateObject 
} from 'actions/ObjectActions';

export function loadNoteFieldsFromFile(file) {
    return loadObjectsFromFile('noteFields', file);
}

export function saveNoteFieldsToFile(file, data) {
    return saveObjectsToFile('noteFields', file, data);
}

export function setNoteFields(noteFields) {
    return setObjects('noteFields', noteFields);
}

export function addNoteField(noteField) {
    return addObject('noteFields', noteField);
}

export function updateNoteField(noteField) {
    return updateObject('noteFields', noteField);
}

export function deleteNoteField(noteFieldId) {
    return deleteObject('noteFields', noteFieldId);
}

export function cleanNoteFields() {
    return cleanObjects('noteFields');
}