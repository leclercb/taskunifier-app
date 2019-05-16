export function getColorFromIndex(index) {
    const colors = [
        'crimson',
        'forestgreen',
        'chocolate',
        'steelblue',
        'goldenrod',
        'darkviolet',
        'slategrey',
        'firebrick',
        'seagreen',
        'saddlebrown',
        'dodgerblue',
        'darkmagenta',
        'darkslategrey',
        'darkorange',
        'olive',
        'sienna',
        'royalblue',
        'blueviolet',
        'teal',
        'slateblue'
    ];

    return colors[index % 20];
}

export function addColorsToArray(array) {
    return array.map((item, index) => {
        item.color = getColorFromIndex(index);
        return item;
    });
}