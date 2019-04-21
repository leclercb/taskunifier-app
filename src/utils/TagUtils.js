export const getTagsFromIds = (tags, tagIds) => {
    if (!tagIds) {
        return [];
    }

    return tags.filter(tag => tagIds.includes(tag.id));
}

export const getTagsFromObjects = objects => {
    let tags = [];

    objects.forEach(object => {
        if (object.tags) {
            tags.push(...object.tags);
        }
    });

    tags = tags.filter((tag, index) => tags.indexOf(tag) === index).sort();

    return tags.map((tag, index) => ({
        id: tag,
        title: tag,
        color: getColorFromIndex(index)
    }))
}

export const updateTag = (object, tagId, newTagId) => {
    if (!object.tags) {
        return;
    }

    object.tags = object.tags.map(tag => tag === tagId ? newTagId : tag);
    object.tags = object.tags.filter((tag, index) => object.tags.indexOf(tag) === index);
}

export const deleteTag = (object, tagId) => {
    if (!object.tags) {
        return;
    }

    object.tags = object.tags.filter(tag => tag !== tagId);
}

export const getColorFromIndex = index => {
    switch (index % 11) {
        case 0: return "magenta";
        case 1: return "green";
        case 2: return "cyan";
        case 3: return "geekblue";
        case 4: return "lime";
        case 5: return "volcano";
        case 6: return "blue";
        case 7: return "orange";
        case 8: return "gold";
        case 9: return "red";
        case 10:
        default: return "purple";
    }
}