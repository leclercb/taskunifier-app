export const getObjects = (state, property) => {
    if (typeof state[property] === 'object') {
        return state[property].present;
    }

    return state[property];
};

export const getObjectById = (state, property, id) => getObjects(state, property).find(object => object.id === id);