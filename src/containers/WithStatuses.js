import React from 'react';
import { getStatuses } from '../data/DataStatuses';

function withStatuses(Component) {
    class WithStatuses extends React.Component {
        render() {
            return (
                <Component {...this.props} statuses={getStatuses()} />
            );
        }
    }

    return WithStatuses
}

export default withStatuses;