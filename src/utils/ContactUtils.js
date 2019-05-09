export function getContactTitle(contact) {
    const firstName = contact && contact.firstName ? contact.firstName : '';
    const lastName = contact && contact.lastName ? contact.lastName : '';

    return `${firstName} ${lastName}`;
};