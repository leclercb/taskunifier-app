import React from 'react';
import { connect } from 'react-redux';

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

    const mapStateToProps = state => ({
        busy: state.processes.busy
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithBusyCheck);
}

export default withBusyCheck;