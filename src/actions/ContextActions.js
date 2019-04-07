export const setContexts = () => {
    return dispatch => {
        dispatch({
            type: 'ON_SUCCESS',
            context: 'CONTEXTS',
            id: 'a'
        });

        dispatch({
            type: 'SET_CONTEXTS',
            contexts: [
                {
                    id: 'context-1',
                    title: 'Context Test 1',
                    color: '#33cc33'
                },
                {
                    id: 'context-2',
                    title: 'Context Test 2',
                    color: '#ff9933'
                },
                {
                    id: 'context-3',
                    title: 'Context Test 3',
                    color: '#ff66ff'
                }
            ]
        });
    };
};