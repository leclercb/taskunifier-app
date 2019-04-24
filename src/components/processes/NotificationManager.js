import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import withProcesses from '../../containers/WithProcesses';

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
        if (props.processes.notifications.length > 0) {
            props.processes.notifications.forEach(notification => {
                message[getLevelFromState(notification.process.state)](notification.process.title);
            });

            props.deleteNotification(props.processes.notifications.map(notification => notification.id));
        }
    });

    return null;
}

NotificationManager.propTypes = {
    processes: PropTypes.object.isRequired,
    deleteNotification: PropTypes.func.isRequired
};

export default withProcesses(NotificationManager);