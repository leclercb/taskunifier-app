import { getPriorities } from "../data/DataPriorities";

export const getPriorityIndex = priorityId => {
    return getPriorities().find(priority => priority.id === priorityId) || 0;
}