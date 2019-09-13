import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskField, deleteTaskField, duplicateTaskField, updateTaskField } from 'actions/TaskFieldActions';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';

export function useTaskFieldApi() {
    const dispatch = useDispatch();
    const taskFields = useSelector(getTaskFieldsIncludingDefaults);

    const addTaskFieldCallback = useCallback(
        taskField => dispatch(addTaskField(taskField)),
        [dispatch]
    );

    const duplicateTaskFieldCallback = useCallback(
        taskField => dispatch(duplicateTaskField(taskField)),
        [dispatch]
    );

    const updateTaskFieldCallback = useCallback(
        taskField => dispatch(updateTaskField(taskField)),
        [dispatch]
    );

    const deleteTaskFieldCallback = useCallback(
        taskFieldId => dispatch(deleteTaskField(taskFieldId)),
        [dispatch]
    );

    return {
        taskFields,
        addTaskField: addTaskFieldCallback,
        duplicateTaskField: duplicateTaskFieldCallback,
        updateTaskField: updateTaskFieldCallback,
        deleteTaskField: deleteTaskFieldCallback
    };
}