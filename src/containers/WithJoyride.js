import React from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { getConfig } from 'constants/JoyrideConfig';
import { useJoyrideApi } from 'hooks/UseJoyrideApi';

function withJoyride(Component) {
    function WithJoyride(props) {
        const joyrideApi = useJoyrideApi();

        const callback = data => {
            const { action, index, status, type } = data;

            if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
                joyrideApi.setJoyrideOptions({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
            } else if ([ACTIONS.CLOSE].includes(action)) {
                joyrideApi.setJoyrideOptions({ run: false });
            } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                joyrideApi.setJoyrideOptions({ run: false });
            }
        };

        return (
            <React.Fragment>
                <Joyride
                    run={!!joyrideApi.joyride.run}
                    stepIndex={joyrideApi.joyride.stepIndex}
                    callback={callback}
                    styles={{
                        options: {
                            zIndex: 2000
                        },
                        tooltip: {
                            fontSize: 13
                        },
                        tooltipContainer: {
                            textAlign: 'left'
                        },
                        tooltipTitle: {
                            fontSize: 15
                        }
                    }}
                    {...getConfig(joyrideApi.joyride.id)} />
                <Component {...props} />
            </React.Fragment>
        );
    }

    return WithJoyride;
}

export default withJoyride;