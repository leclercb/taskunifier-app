import { getStatuses } from 'data/DataStatuses';

export function useStatusApi() {
    const statuses = getStatuses();

    return {
        statuses
    };
}