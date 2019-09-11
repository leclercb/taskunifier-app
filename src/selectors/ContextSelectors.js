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

export const getVisibleContext = id => createSelector(
    getContextsFilteredByVisibleState,
    (contexts) => {
        return contexts.find(context => context.id === id);
    }
);