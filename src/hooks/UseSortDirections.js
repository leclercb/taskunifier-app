import { getSortDirections } from 'data/DataSortDirections';

export function useSortDirections() {
    const sortDirections = getSortDirections();

    return {
        sortDirections
    };
}