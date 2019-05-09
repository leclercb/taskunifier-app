export function getColorFromIndex(index) {
    switch (index % 11) {
        case 0: return 'magenta';
        case 1: return 'green';
        case 2: return 'cyan';
        case 3: return 'geekblue';
        case 4: return 'lime';
        case 5: return 'volcano';
        case 6: return 'blue';
        case 7: return 'orange';
        case 8: return 'gold';
        case 9: return 'red';
        case 10:
        default: return 'purple';
    }
};