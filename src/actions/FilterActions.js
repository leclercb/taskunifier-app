export const setFilters = () => {
    return dispatch => {
        dispatch({
            type: 'ON_SUCCESS',
            context: 'FILTERS',
            id: 'a'
        });

        dispatch({
            type: 'SET_FILTERS',
            filters: [
                {
                    id: 'filter-1',
                    title: 'Filter Test 1'
                },
                {
                    id: 'filter-2',
                    title: 'Filter Test 2'
                },
                {
                    id: 'filter-3',
                    title: 'Filter Test 3'
                }
            ]
        });
    };
};