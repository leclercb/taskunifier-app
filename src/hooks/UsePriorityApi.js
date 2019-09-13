import { getPriorities } from 'data/DataPriorities';

export function usePriorityApi() {
    const priorities = getPriorities();

    return {
        priorities
    };
}