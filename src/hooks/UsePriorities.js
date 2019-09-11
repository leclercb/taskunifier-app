import { getPriorities } from 'data/DataPriorities';

export function usePriorities() {
    const priorities = getPriorities();

    return {
        priorities
    };
}