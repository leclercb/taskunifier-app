import React from 'react';
import { getSortDirections } from 'data/DataSortDirections';

function withSortDirections(Component) {
    class WithSortDirections extends React.Component {
        render() {
            return (
                <Component {...this.props} sortDirections={getSortDirections()} />
            );
        }
    }

    return WithSortDirections;
}

export default withSortDirections;