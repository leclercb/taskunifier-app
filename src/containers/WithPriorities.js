import React from 'react';
import { getPriorities } from 'data/DataPriorities';

function withPriorities(Component) {
    class WithPriorities extends React.Component {
        render() {
            return (
                <Component {...this.props} priorities={getPriorities()} />
            );
        }
    }

    return WithPriorities;
}

export default withPriorities;