import { useEffect } from 'react';
import { message } from 'antd';
import { useThreadApi } from 'hooks/UseThreadApi';

function NotificationManager() {
    const threadApi = useThreadApi();

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