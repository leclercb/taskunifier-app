import React from 'react';
import { Button } from 'antd';
import Icon from '../common/Icon';
import withStatus from '../../containers/WithStatus';

function AppFooter(props) {
    let notification = null;

    if (props.status.notifications.length > 0) {
        notification = props.status.notifications[props.status.notifications.length - 1];
    }

    const onShowStatus = () => {
        props.setStatusVisible(true);
    }

    return (
        <React.Fragment>
            <span>TaskUnifier 2 ©2019 Created by BL-IT</span>
            <span>{notification ? notification.status + ': ' + notification.title : ''}</span>
            <Button onClick={onShowStatus}><Icon icon="cogs" text="Show status" /></Button>
        </React.Fragment>
    );
}

export default withStatus(AppFooter);