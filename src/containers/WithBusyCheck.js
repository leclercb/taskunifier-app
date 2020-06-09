import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isBusy } from 'selectors/ThreadSelectors';

function withBusyCheck(Component, getApis) {
    function WithApis(props) {
        const busy = useSelector(isBusy);
        const apis = getApis(props);

        return (<WithBusyCheck {...props} apis={apis} busy={busy} />);
    }

    class WithBusyCheck extends React.Component {
        shouldComponentUpdate(nextProps) {
            return !nextProps.busy;
        }

        render() {
            const wrappedProps = { ...this.props };
            delete wrappedProps.busy;
            delete wrappedProps.forwardedRef;

            return (<Component ref={this.props.forwardedRef} {...wrappedProps} />);
        }
    }

    WithBusyCheck.propTypes = {
        busy: PropTypes.bool.isRequired,
        forwardedRef: PropTypes.any
    };

    return React.forwardRef((props, ref) => (<WithApis {...props} forwardedRef={ref} />)); // eslint-disable-line react/display-name
}

export default withBusyCheck;