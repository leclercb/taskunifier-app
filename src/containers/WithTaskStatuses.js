import React from 'react';
import { getTaskStatuses } from '../data/DataTaskStatuses';

function withTaskStatuses(Component) {
    class WithTaskStatuses extends React.Component {
        render() {
            return (
                <Component {...this.props} taskStatuses={getTaskStatuses()} />
            );
        }
    }

    return WithTaskStatuses
}

export default withTaskStatuses;