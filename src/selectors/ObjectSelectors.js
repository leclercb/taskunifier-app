export const getObjects = (state, property) => {
    if (Array.isArray(state[property])) {
        return state[property];
    }

    return state[property].present;
};

export const getObjectById = (state, property, id) => getObjects(state, property).find(object => object.id === id);