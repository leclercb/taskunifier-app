import React from 'react';
import { getSortDirections } from 'data/DataSortDirections';

function withSortDirection(Component, getId = ownProps => ownProps.sortDirectionId) {
    function WithSortDirection(props) {
        const sortDirection = getSortDirections().find(property => property.id === getId(props));

        return (
            <Component {...props} sortDirection={sortDirection} />
        );
    }

    return WithSortDirection;
}

export default withSortDirection;