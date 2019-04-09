import React from 'react';
import PropTypes from 'prop-types';
import withStatus from '../../containers/WithStatus';
import Icon from '../common/Icon';

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
                return '#20639b';
            case 'COMPLETED':
                return '#3caea3';
            case 'ERROR':
            default:
                return '#ed553b';
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
                </div>
            )}
        </React.Fragment>
    );
}

Status.propTypes = {
    status: PropTypes.object.isRequired
}

export default withStatus(Status);