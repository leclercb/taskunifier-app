import React from 'react';
import PropTypes from 'prop-types';
import { getTaskStatuses } from '../data/DataTaskStatuses';

function withTaskStatus(Component, propertyId = 'taskStatusId') {
    function WithTaskStatus(props) {
        const taskStatus = getTaskStatuses().find(property => property.id === props[propertyId]);

        return <Component {...props} taskStatus={taskStatus} />
    }

    WithTaskStatus.propTypes = {
        [propertyId]: PropTypes.string
    }

    return WithTaskStatus;
}

export default withTaskStatus;