import { createSelector } from 'reselect';
import { filterByNonArchived, filterByVisibleState } from 'utils/CategoryUtils';
import { compareStrings } from 'utils/CompareUtils';

export const getFolders = state => state.folders;

export const getFoldersFilteredByVisibleState = createSelector(
    getFolders,
    (folders) => {
        return filterByVisibleState(folders).sort((a, b) => compareStrings(a.title, b.title));
    }
);

export const getFoldersFilteredByNonArchived = createSelector(
    getFoldersFilteredByVisibleState,
    (folders) => {
        return filterByNonArchived(folders);
    }
);

export const getVisibleFolderSelector = () => createSelector(
    getFoldersFilteredByVisibleState,
    (state, id) => id,
    (folders, id) => {
        return folders.find(folder => folder.id === id);
    }
);