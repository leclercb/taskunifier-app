import { getColorFromIndex } from 'utils/ColorUtils';

export function getTagsFromIds(tags, tagIds) {
    if (!tagIds) {
        return [];
    }

    return tags.filter(tag => tagIds.includes(tag.id));
}

export function getTagsFromObjects(objects, settings = {}) {
    let tags = [];

    objects.forEach(object => {
        if (object.tags) {
            tags.push(...object.tags);
        }
    });

    tags = tags.filter((tag, index) => tags.indexOf(tag) === index).sort();

    return tags.map((tag, index) => {
        let color = getColorFromIndex(index);

        if (`tagColor_${btoa(tag)}` in settings) {
            color = settings[`tagColor_${btoa(tag)}`];
        }

        return {
            id: tag,
            title: tag,
            color
        };
    });
}

export function updateTag(object, tagId, newTagId) {
    if (!object.tags) {
        return;
    }

    object.tags = object.tags.map(tag => tag === tagId ? newTagId : tag);
    object.tags = object.tags.filter((tag, index) => object.tags.indexOf(tag) === index);
}

export function deleteTag(object, tagId) {
    if (!object.tags) {
        return;
    }

    object.tags = object.tags.filter(tag => tag !== tagId);
}