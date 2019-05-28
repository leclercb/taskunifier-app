import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProMessage from 'components/pro/ProMessage';
import withBusyCheck from 'containers/WithBusyCheck';
import { isValidLicense } from 'selectors/AppSelectors';

function withProCheck(Component) {
    class WithProCheck extends React.Component {
        render() {
            const { pro, ...restProps } = this.props;

            if (!pro) {
                return (
                    <ProMessage />
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
        pro: isValidLicense(state)
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(WithProCheck));
}

export default withProCheck;