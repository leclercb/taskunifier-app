import { createSelector } from 'reselect';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getLinksFromObjects } from 'utils/LinkUtils';

export const getLinksSelector = () => createSelector(
    getTasksFilteredByVisibleState,
    (state, property) => property,
    (tasks, property) => {
        return getLinksFromObjects(tasks, property);
    }
);