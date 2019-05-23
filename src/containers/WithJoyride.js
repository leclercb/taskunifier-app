import React from 'react';
import PropTypes from 'prop-types';
import Joyride, { STATUS } from 'react-joyride';
import { connect } from 'react-redux';
import { setJoyrideOptions } from 'actions/AppActions';
import { getConfig } from 'constants/JoyrideConfig';
import withBusyCheck from 'containers/WithBusyCheck';
import { getJoyrideOptions } from 'selectors/AppSelectors';

function withJoyride(Component) {
    function WithJoyride(props) {
        const callback = data => {
            const { status } = data;

            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                props.setJoyrideOptions({ run: false });
            }
        };

        const { joyride, ...restProps } = props;

        return (
            <React.Fragment>
                <Joyride
                    run={!!joyride.run}
                    callback={callback}
                    styles={{
                        options: {
                            zIndex: 2000
                        }
                    }}
                    {...getConfig(joyride.id)} />
                <Component {...restProps} />
            </React.Fragment>
        );
    }

    WithJoyride.propTypes = {
        joyride: PropTypes.shape({
            id: PropTypes.string,
            run: PropTypes.bool
        }).isRequired,
        setJoyrideOptions: PropTypes.func.isRequired
    };

    const mapStateToProps = state => ({
        joyride: getJoyrideOptions(state)
    });

    const mapDispatchToProps = dispatch => ({
        setJoyrideOptions: options => dispatch(setJoyrideOptions(options))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(WithJoyride));
}

export default withJoyride;