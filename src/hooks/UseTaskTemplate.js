import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVisibleTaskTemplateSelector } from 'selectors/TaskTemplateSelectors';

export function useTaskTemplate(taskTemplateId) {
    const getVisibleTaskTemplate = useMemo(getVisibleTaskTemplateSelector, []);
    const taskTemplate = useSelector(state => getVisibleTaskTemplate(state, taskTemplateId));
    return taskTemplate;
}