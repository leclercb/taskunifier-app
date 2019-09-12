import { createSelector } from 'reselect';
import { filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getContexts = state => state.contexts;

export const getContextsFilteredByVisibleState = createSelector(
    getContexts,
    (contexts) => {
        return filterByVisibleState(contexts).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getVisibleContextSelector = () => createSelector(
    getContextsFilteredByVisibleState,
    (state, id) => id,
    (contexts, id) => {
        return contexts.find(context => context.id === id);
    }
);