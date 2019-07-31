export const getObjects = (state, property) => state[property];
export const getObjectById = (state, property, id) => state[property].find(object => object.id === id);