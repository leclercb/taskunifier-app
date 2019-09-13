import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTag, updateTag } from 'actions/TagActions';
import { getTags } from 'selectors/TagSelectors';

export function useTagApi() {
    const dispatch = useDispatch();
    const tags = useSelector(getTags);

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