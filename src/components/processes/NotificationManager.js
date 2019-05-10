import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import withThread from 'containers/WithThread';
import { NotificationPropType } from 'proptypes/NotificationPropTypes';

function NotificationManager(props) {
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
        if (props.notifications.length > 0) {
            props.notifications.forEach(notification => {
                message[getLevelFromState(notification.process.state)](notification.process.title);
            });

            props.deleteNotification(props.notifications.map(notification => notification.id));
        }
    });

    return null;
}

NotificationManager.propTypes = {
    notifications: PropTypes.arrayOf(NotificationPropType.isRequired).isRequired,
    deleteNotification: PropTypes.func.isRequired
};

export default withThread(NotificationManager);