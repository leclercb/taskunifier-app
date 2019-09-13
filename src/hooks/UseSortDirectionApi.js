import { getSortDirections } from 'data/DataSortDirections';

export function useSortDirectionApi() {
    const sortDirections = getSortDirections();

    return {
        sortDirections
    };
}