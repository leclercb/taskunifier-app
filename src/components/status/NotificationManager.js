import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import withStatus from '../../containers/WithStatus';

function NotificationManager(props) {
    const getLevelFromStatus = status => {
        switch (status) {
            case 'RUNNING':
                return 'loading';
            case 'COMPLETED':
                return 'success';
            case 'ERROR':
            default:
                return 'error';
        }
    }

    useEffect(() => {
        if (props.status.notifications.length > 0) {
            props.status.notifications.forEach(notification => {
                message[getLevelFromStatus(notification.process.status)](notification.process.title);
            });

            props.deleteNotification(props.status.notifications.map(notification => notification.id));
        }
    });

    return null;
}

NotificationManager.propTypes = {
    status: PropTypes.object.isRequired,
    deleteNotification: PropTypes.func.isRequired
};

export default withStatus(NotificationManager);