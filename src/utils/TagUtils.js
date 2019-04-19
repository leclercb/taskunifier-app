export const getTagsFromIds = (tags, tagIds) => {
    if (!tagIds) {
        return [];
    }

    return tags.filter(tag => tagIds.includes(tag.id));
}

export const getTagsFromTasks = tasks => {
    let tags = [];

    tasks.forEach(task => {
        if (task.tags) {
            tags.push(...task.tags);
        }
    });

    tags = tags.filter((tag, index) => tags.indexOf(tag) === index).sort();

    return tags.map((tag, index) => ({
        id: tag,
        title: tag,
        color: getColorFromIndex(index)
    }))
}

export const getColorFromIndex = index => {
    switch (index % 11) {
        case 0: return "magenta";
        case 6: return "green";
        case 7: return "cyan";
        case 1: return "geekblue";
        case 5: return "lime";
        case 2: return "volcano";
        case 8: return "blue";
        case 3: return "orange";
        case 4: return "gold";
        case 9: return "red";
        case 10:
        default: return "purple";
    }
}