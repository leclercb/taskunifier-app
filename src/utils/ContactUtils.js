export const getContactTitle = contact => {
    const firstName = contact.firstName ? contact.firstName : '';
    const lastName = contact.lastName ? contact.lastName : '';

    return `${firstName} ${lastName}`;
};