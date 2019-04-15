import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import withStatus from '../../containers/WithStatus';
import Icon from '../common/Icon';
import Constants from '../constants/Constants';

function Status(props) {
    const getIconFromStatus = status => {
        switch (status) {
            case 'RUNNING':
                return 'spinner';
            case 'COMPLETED':
                return 'check';
            case 'ERROR':
            default:
                return 'exclamation-circle';
        }
    }

    const getColorFromStatus = status => {
        switch (status) {
            case 'RUNNING':
                return Constants.processRunningColor;
            case 'COMPLETED':
                return Constants.processCompletedColor;
            case 'ERROR':
            default:
                return Constants.processErrorColor;
        }
    }

    return (
        <React.Fragment>
            {props.status.processes.map(process =>
                <div key={process.id}>
                    <Icon
                        text={process.title}
                        icon={getIconFromStatus(process.status)}
                        color={getColorFromStatus(process.status)} />
                    {process.status === 'ERROR' && process.error ? (
                        <Alert type="error" message={process.error} showIcon={true} />
                    ) : null}
                </div>
            )}
        </React.Fragment>
    );
}

Status.propTypes = {
    status: PropTypes.object.isRequired
};

export default withStatus(Status);