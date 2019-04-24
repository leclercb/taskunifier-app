import React from 'react';
import PropTypes from 'prop-types';
import { getStatuses } from '../data/DataStatuses';

function withStatus(Component, propertyId = 'statusId') {
    function WithStatus(props) {
        const status = getStatuses().find(property => property.id === props[propertyId]);

        return (
            <Component {...props} status={status} />
        );
    }

    WithStatus.propTypes = {
        [propertyId]: PropTypes.string
    };

    return WithStatus;
}

export default withStatus;