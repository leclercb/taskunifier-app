import { move } from 'utils/ArrayUtils';

describe('move item', () => {
    test('0 to 1', () => {
        const array = ['a', 'b', 'c', 'd'];
        move(array, 0, 1);

        expect(array).toHaveLength(4);
        expect(array).toEqual(['b', 'a', 'c', 'd']);
    });

    test('2 to 3', () => {
        const array = ['a', 'b', 'c', 'd'];
        move(array, 2, 3);

        expect(array).toHaveLength(4);
        expect(array).toEqual(['a', 'b', 'd', 'c']);
    });

    test('0 to 3', () => {
        const array = ['a', 'b', 'c', 'd'];
        move(array, 0, 3);

        expect(array).toHaveLength(4);
        expect(array).toEqual(['b', 'c', 'd', 'a']);
    });

    test('0 to 4', () => {
        const array = ['a', 'b', 'c', 'd'];
        move(array, 0, 4);

        expect(array).toHaveLength(5);
        expect(array).toEqual(['b', 'c', 'd', undefined, 'a']);
    });
});