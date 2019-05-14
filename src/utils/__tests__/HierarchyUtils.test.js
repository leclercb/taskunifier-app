import { findParents } from 'utils/HierarchyUtils';

const objects = [
    {
        id: 'A'
    },
    {
        id: 'A.A',
        parent: 'A'
    },
    {
        id: 'A.B',
        parent: 'A'
    },
    {
        id: 'A.A.A',
        parent: 'A.A'
    },
    {
        id: 'A.A.B',
        parent: 'A.A'
    },
    {
        id: 'A.A.B.A',
        parent: 'A.A.B'
    },
    {
        id: 'A.A.B.A.A',
        parent: 'A.A.B.A'
    },
    {
        id: 'B'
    },
    {
        id: 'B.A',
        parent: 'B'
    }
];

describe('find parents', () => {
    test('of object A', () => {
        expect(findParents(objects.find(object => object.id === 'A'), objects)).toMatchSnapshot();
    });

    test('of object A.A', () => {
        expect(findParents(objects.find(object => object.id === 'A.A'), objects)).toMatchSnapshot();
    });

    test('of object A.B', () => {
        expect(findParents(objects.find(object => object.id === 'A.B'), objects)).toMatchSnapshot();
    });

    test('of object A.A.A', () => {
        expect(findParents(objects.find(object => object.id === 'A.A.A'), objects)).toMatchSnapshot();
    });

    test('of object A.A.B', () => {
        expect(findParents(objects.find(object => object.id === 'A.A.B'), objects)).toMatchSnapshot();
    });

    test('of object A.A.B.A', () => {
        expect(findParents(objects.find(object => object.id === 'A.A.B.A'), objects)).toMatchSnapshot();
    });

    test('of object A.A.B.A.A', () => {
        expect(findParents(objects.find(object => object.id === 'A.A.B.A.A'), objects)).toMatchSnapshot();
    });
    test('of object B.A', () => {
        expect(findParents(objects.find(object => object.id === 'B.A'), objects)).toMatchSnapshot();
    });
});