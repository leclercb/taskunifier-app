import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProLockedMessage from 'components/pro/ProLockedMessage';
import withBusyCheck from 'containers/WithBusyCheck';
import { isPro } from 'selectors/AppSelectors';

function withProCheck(Component) {
    class WithProCheck extends React.Component {
        render() {
            const { pro, ...restProps } = this.props;

            if (!pro) {
                return (
                    <ProLockedMessage />
                );
            }

            return (
                <Component {...restProps} />
            );
        }
    }

    WithProCheck.propTypes = {
        pro: PropTypes.bool.isRequired
    };

    const mapStateToProps = state => ({
        pro: isPro(state)
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(WithProCheck));
}

export default withProCheck;