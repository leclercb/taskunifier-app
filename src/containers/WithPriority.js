import React from 'react';
import PropTypes from 'prop-types';
import { getPriorities } from '../data/DataPriorities';

function withPriority(Component, propertyId = 'priorityId') {
    function WithPriority(props) {
        const priority = getPriorities().find(property => property.id === props[propertyId]);

        return (
            <Component {...props} priority={priority} />
        );
    }

    WithPriority.propTypes = {
        [propertyId]: PropTypes.string
    };

    return WithPriority;
}

export default withPriority;