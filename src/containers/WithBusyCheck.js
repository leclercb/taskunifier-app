import React from 'react';
import PropTypes from 'prop-types';
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

    WithBusyCheck.propTypes = {
        busy: PropTypes.bool.isRequired
    };

    const mapStateToProps = state => ({
        busy: state.processes.busy
    });

    return connect(
        mapStateToProps,
        null
    )(WithBusyCheck);
}

export default withBusyCheck;