import { createSelector } from 'reselect';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getTagsFromObjects } from 'utils/TagUtils';

export const getTags = createSelector(
    getNotesFilteredByVisibleState,
    getTasksFilteredByVisibleState,
    getSettings,
    (notes, tasks, settings) => {
        return getTagsFromObjects(notes.concat(tasks), settings);
    }
);