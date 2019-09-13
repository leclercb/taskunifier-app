import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditingCell } from 'actions/AppActions';
import { getEditingCell } from 'selectors/AppSelectors';

export function useEditingCellApi() {
    const dispatch = useDispatch();

    const editingCell = useSelector(getEditingCell);

    const setEditingCellCallback = useCallback(
        (objectId, fieldId) => dispatch(setEditingCell(objectId, fieldId)),
        [dispatch]
    );

    return {
        editingCell,
        setEditingCell: setEditingCellCallback
    };
}