import { setFolders } from "./FolderActions";
import { setContexts } from "./ContextActions";
import { setFields } from "./FieldActions";
import { setFilters } from "./FilterActions";
import { setTasks } from "./TaskActions";

export const synchronize = () => {
    return dispatch => {
        setContexts()(dispatch);
        setFields()(dispatch);
        setFilters()(dispatch);
        setFolders()(dispatch);
        setTasks()(dispatch);
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