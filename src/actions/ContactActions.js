import { loadObjectsFromFile, saveObjectsToFile, setObjects, addObject, updateObject, deleteObject, cleanObjects } from './ObjectActions';

export const loadContactsFromFile = file => {
    return loadObjectsFromFile('contacts', file);
};

export const saveContactsToFile = (file, data) => {
    return saveObjectsToFile('contacts', file, data);
};

export const setContacts = contacts => {
    return setObjects('contacts', contacts);
};

export const addContact = contact => {
    return addObject('contacts', contact);
};

export const updateContact = contact => {
    return updateObject('contacts', contact);
};

export const deleteContact = contactId => {
    return deleteObject('contacts', contactId);
};

export const cleanContacts = () => {
    return cleanObjects('contacts');
};