import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearProcesses, deleteNotification, setThreadManagerVisible } from 'actions/ThreadActions';
import { getNotifications, getProcesses, isThreadManagerVisible } from 'selectors/ThreadSelectors';

export function useThreadApi() {
    const dispatch = useDispatch();

    const threadManagerVisible = useSelector(isThreadManagerVisible);
    const processes = useSelector(getProcesses);
    const notifications = useSelector(getNotifications);

    const setThreadManagerVisibleCallback = useCallback(
        visible => dispatch(setThreadManagerVisible(visible)),
        [dispatch]
    );

    const clearProcessesCallback = useCallback(
        () => dispatch(clearProcesses()),
        [dispatch]
    );

    const deleteNotificationCallback = useCallback(
        notificationId => dispatch(deleteNotification(notificationId)),
        [dispatch]
    );

    return {
        threadManagerVisible,
        processes,
        notifications,
        setThreadManagerVisible: setThreadManagerVisibleCallback,
        clearProcesses: clearProcessesCallback,
        deleteNotification: deleteNotificationCallback
    };
}