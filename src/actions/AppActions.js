import { loadFolders } from "./FolderActions";
import { loadContexts } from "./ContextActions";
import { loadFilters } from "./FilterActions";
import { loadTasks } from "./TaskActions";

export const synchronize = () => {
    return dispatch => {
        loadContexts()(dispatch);
        loadFilters()(dispatch);
        loadFolders()(dispatch);
        loadTasks()(dispatch);
    };
};

export const setSelectedFilter = filter => {
    return dispatch => {
        dispatch({
            type: 'SET_SELECTED_FILTER',
            filter: filter
        });
    };
};