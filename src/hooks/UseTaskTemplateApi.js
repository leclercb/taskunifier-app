import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskTemplate, deleteTaskTemplate, duplicateTaskTemplate, updateTaskTemplate } from 'actions/TaskTemplateActions';
import { getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';

export function useTaskTemplateApi() {
    const dispatch = useDispatch();
    const taskTemplates = useSelector(getTaskTemplatesFilteredByVisibleState);

    const addTaskTemplateCallback = useCallback(
        taskTemplate => dispatch(addTaskTemplate(taskTemplate)),
        [dispatch]
    );

    const duplicateTaskTemplateCallback = useCallback(
        taskTemplate => dispatch(duplicateTaskTemplate(taskTemplate)),
        [dispatch]
    );

    const updateTaskTemplateCallback = useCallback(
        taskTemplate => dispatch(updateTaskTemplate(taskTemplate)),
        [dispatch]
    );

    const deleteTaskTemplateCallback = useCallback(
        taskTemplateId => dispatch(deleteTaskTemplate(taskTemplateId)),
        [dispatch]
    );

    return {
        taskTemplates,
        addTaskTemplate: addTaskTemplateCallback,
        duplicateTaskTemplate: duplicateTaskTemplateCallback,
        updateTaskTemplate: updateTaskTemplateCallback,
        deleteTaskTemplate: deleteTaskTemplateCallback
    };
}