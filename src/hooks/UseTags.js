import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTag, updateTag } from 'actions/TagActions';
import { getTagsFromObjects } from 'utils/TagUtils';
import { getNotesFilteredByVisibleState } from 'selectors/NoteSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';

export function useTags() {
    const dispatch = useDispatch();
    const settings = useSelector(getSettings);
    const notes = useSelector(getNotesFilteredByVisibleState);
    const tasks = useSelector(getTasksFilteredByVisibleState);
    const tags = getTagsFromObjects(notes.concat(tasks), settings);

    const updateTagCallback = useCallback(
        tag => dispatch(updateTag(tag)),
        [dispatch]
    );

    const deleteTagCallback = useCallback(
        tag => dispatch(deleteTag(tag)),
        [dispatch]
    );

    return {
        tags,
        updateTag: updateTagCallback,
        deleteTag: deleteTagCallback
    };
}