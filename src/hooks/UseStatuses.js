import { getStatuses } from 'data/DataStatuses';

export function useStatuses() {
    const statuses = getStatuses();

    return {
        statuses
    };
}