import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isBusy } from 'selectors/ThreadSelectors';

function withBusyCheck(Component, getApis) {
    function WithApis(props) {
        const busy = useSelector(isBusy);
        const apis = getApis();

        return (<WithBusyCheck {...props} apis={apis} busy={busy} />);
    }

    class WithBusyCheck extends React.Component {
        shouldComponentUpdate(nextProps) {
            return !nextProps.busy;
        }

        render() {
            const wrappedProps = { ...this.props };
            delete wrappedProps.busy;

            return (<Component {...wrappedProps} />);
        }
    }

    WithBusyCheck.propTypes = {
        busy: PropTypes.bool.isRequired
    };

    return WithApis;
}

export default withBusyCheck;