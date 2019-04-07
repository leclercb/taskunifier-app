import React, { useState } from 'react';
import withStatus from '../../containers/WithStatus';

function AppFooter(props) {
    return (
        <React.Fragment>
            <span>TaskUnifier 2 ©2019 Created by BL-IT</span>
            <span>{props.status.notifications.length > 0 ? props.status.notifications[props.status.notifications.length - 1] : ''}</span>
        </React.Fragment>
    );
}

export default withStatus(AppFooter);