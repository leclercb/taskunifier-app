export const getObjects = (state, property) => state[property].present;
export const getObjectById = (state, property, id) => state[property].present.find(object => object.id === id);