import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import Icon from 'components/common/Icon';
import Constants from 'constants/Constants';
import { ProcessPropType } from 'proptypes/ProcessPropTypes';

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

    const getErrorElement = process => {
        if (process.state === 'ERROR' && process.error) {
            const errors = Array.isArray(process.error) ? process.error : [process.error];

            return errors.map(error => (
                <Alert key={error} type="error" message={error} showIcon={true} />
            ));
        }

        return null;
    };

    return (
        <React.Fragment>
            {props.processes.map(process => (
                <div key={process.id}>
                    <Icon
                        text={process.title}
                        icon={getIconFromState(process.state)}
                        color={getColorFromState(process.state)} />
                    {getErrorElement(process)}
                </div>
            ))}
        </React.Fragment>
    );
}

ProcessList.propTypes = {
    processes: PropTypes.arrayOf(ProcessPropType.isRequired).isRequired
};

export default ProcessList;