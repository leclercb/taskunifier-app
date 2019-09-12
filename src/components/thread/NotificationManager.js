import { useEffect } from 'react';
import { message } from 'antd';
import { useThreads } from 'hooks/UseThreads';

function NotificationManager() {
    const threadApi = useThreads();

    const getLevelFromState = state => {
        switch (state) {
            case 'RUNNING':
                return 'loading';
            case 'COMPLETED':
                return 'success';
            case 'ERROR':
            default:
                return 'error';
        }
    };

    useEffect(() => {
        if (threadApi.notifications.length > 0) {
            threadApi.notifications.forEach(notification => {
                message[getLevelFromState(notification.process.state)](notification.process.title);
            });

            threadApi.deleteNotification(threadApi.notifications.map(notification => notification.id));
        }
    });

    return null;
}

export default NotificationManager;