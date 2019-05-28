import React from 'react';
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

    const mapStateToProps = state => ({
        pro: isValidLicense(state)
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(WithProCheck));
}

export default withProCheck;