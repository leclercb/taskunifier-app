import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import withStatus from '../../containers/WithStatus';

function Status(props) {
    const getTypeFromStatus = status => {
        switch (status) {
            case 'RUNNING':
                return 'info';
            case 'COMPLETED':
                return 'success';
            case 'ERROR':
            default:
                return 'error';
        }
    }

    return (
        <React.Fragment>
            <span>Status: {props.status.busy ? 'Busy' : 'Idle'}</span>
            {props.status.processes.map(process =>
                <Alert message={process.title} type={getTypeFromStatus(process.status)} showIcon />)}
        </React.Fragment>
    );
}

Status.propTypes = {
    status: PropTypes.object.isRequired
}

export default withStatus(Status);