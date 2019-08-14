export function getColorFromIndex(index) {
    const colors = [
        '#dc143c',
        '#228b22',
        '#d2691e',
        '#4682b4',
        '#b8860b',
        '#9400d3',
        '#708090',
        '#b22222',
        '#2e8b57',
        '#8b4513',
        '#1e90ff',
        '#8b008b',
        '#2f4f4f',
        '#ff8c00',
        '#808000',
        '#a0522d',
        '#4169e1',
        '#8a2be2',
        '#008080',
        '#6a5acd'
    ];

    return colors[index % 20];
}

export function addColorsToArray(array) {
    return array.map((item, index) => {
        item.color = getColorFromIndex(index);
        return item;
    });
}