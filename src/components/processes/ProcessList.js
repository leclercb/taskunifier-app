import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import withProcesses from '../../containers/WithProcesses';
import Icon from '../common/Icon';
import Constants from '../../constants/Constants';

function ProcessList(props) {
    const getIconFromState = state => {
        switch (state) {
            case 'RUNNING':
                return 'spinner';
            case 'COMPLETED':
                return 'check';
            case 'ERROR':
            default:
                return 'exclamation-circle';
        }
    };

    const getColorFromState = state => {
        switch (state) {
            case 'RUNNING':
                return Constants.processRunningColor;
            case 'COMPLETED':
                return Constants.processCompletedColor;
            case 'ERROR':
            default:
                return Constants.processErrorColor;
        }
    };

    return (
        <React.Fragment>
            {props.processes.processes.map(process =>
                <div key={process.id}>
                    <Icon
                        text={process.title}
                        icon={getIconFromState(process.state)}
                        color={getColorFromState(process.state)} />
                    {process.state === 'ERROR' && process.error ? (
                        <Alert type="error" message={process.error} showIcon={true} />
                    ) : null}
                </div>
            )}
        </React.Fragment>
    );
}

ProcessList.propTypes = {
    processes: PropTypes.object.isRequired
};

export default withProcesses(ProcessList);