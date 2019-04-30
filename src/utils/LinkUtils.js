import { getColorFromIndex } from 'utils/ColorUtils';

export const getLinksFromIds = (links, linkIds) => {
    if (!linkIds) {
        return [];
    }

    return links.filter(link => linkIds.includes(link.id));
};

export const getLinksFromObjects = (objects, property) => {
    let links = [];

    objects.forEach(object => {
        if (object[property]) {
            object[property].forEach(item => {
                if (item.links) {
                    links.push(...item.links);
                }
            });
        }
    });

    links = links.filter((link, index) => links.indexOf(link) === index).sort();

    return links.map((link, index) => ({
        id: link,
        title: link,
        color: getColorFromIndex(index)
    }));
};