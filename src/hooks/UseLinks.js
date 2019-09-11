import { useSelector } from 'react-redux';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';

export function useLinks(property) {
    const tasks = useSelector(getTasksFilteredByVisibleState);
    const links = getLinksFromObjects(tasks, property);

    return {
        links
    };
}