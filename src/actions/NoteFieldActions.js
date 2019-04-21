import { 
    loadObjectsFromFile, 
    saveObjectsToFile, 
    setObjects, 
    addObject, 
    updateObject, 
    deleteObject, 
    cleanObjects 
} from './ObjectActions';

export const loadNoteFieldsFromFile = file => {
    return loadObjectsFromFile('noteFields', file);
};

export const saveNoteFieldsToFile = (file, data) => {
    return saveObjectsToFile('noteFields', file, data);
};

export const setNoteFields = noteFields => {
    return setObjects('noteFields', noteFields);
};

export const addNoteField = noteField => {
    return addObject('noteFields', noteField);
};

export const updateNoteField = noteField => {
    return updateObject('noteFields', noteField);
};

export const deleteNoteField = noteFieldId => {
    return deleteObject('noteFields', noteFieldId);
};

export const cleanNoteFields = () => {
    return cleanObjects('noteFields');
};