import React from 'react';

function withBusyCheck(Component) {
    class WithBusyCheck extends React.Component {
        shouldComponentUpdate(nextProps) {
            return !nextProps.busy;
        }

        render() {
            const wrappedProps = { ...this.props };
            delete wrappedProps.busy;

            return (
                <Component {...wrappedProps} />
            );
        }
    }

    return WithBusyCheck;
}

export default withBusyCheck;