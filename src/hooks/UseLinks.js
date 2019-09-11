import { useSelector } from 'react-redux';
import { getTasksFilteredByVisibleState } from 'selectors/TaskSelectors';
import { getLinksFromObjects } from 'utils/LinkUtils';

export function useLinks(property) {
    const tasks = useSelector(getTasksFilteredByVisibleState);
    const links = getLinksFromObjects(tasks, property);

    return {
        links
    };
}