import React from 'react';
import { getPriorities } from 'data/DataPriorities';

function withPriority(Component, getId = ownProps => ownProps.priorityId) {
    function WithPriority(props) {
        const priority = getPriorities().find(property => property.id === getId(props));

        return (
            <Component {...props} priority={priority} />
        );
    }

    return WithPriority;
}

export default withPriority;