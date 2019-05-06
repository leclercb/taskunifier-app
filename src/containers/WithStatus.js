import React from 'react';
import { getStatuses } from 'data/DataStatuses';

function withStatus(Component, getId = ownProps => ownProps.statusId) {
    function WithStatus(props) {
        const status = getStatuses().find(property => property.id === getId(props));

        return (
            <Component {...props} status={status} />
        );
    }

    return WithStatus;
}

export default withStatus;