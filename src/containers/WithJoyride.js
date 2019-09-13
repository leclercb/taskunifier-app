import React from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { getConfig } from 'constants/JoyrideConfig';
import { useJoyrideApi } from 'hooks/UseJoyrideApi';

function withJoyride(Component) {
    function WithJoyride(props) {
        const joyrideApi = useJoyrideApi();

        const callback = data => {
            const { status } = data;

            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                joyrideApi.setJoyrideOptions({ run: false });
            }
        };

        return (
            <React.Fragment>
                <Joyride
                    run={!!joyrideApi.joyride.run}
                    callback={callback}
                    styles={{
                        options: {
                            zIndex: 2000
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