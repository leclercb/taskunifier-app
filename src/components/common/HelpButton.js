import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import withJoyride from 'containers/WithJoyride';
import { useJoyrideApi } from 'hooks/UseJoyrideApi';

function HelpButton(props) {
    const joyrideApi = useJoyrideApi();

    const onClick = () => {
        joyrideApi.setJoyrideOptions({
            id: props.id,
            run: true
        });
    };

    return (
        <Icon
            icon="question-circle"
            size={18}
            style={{
                cursor: 'pointer'
            }}
            onClick={onClick} />
    );
}

HelpButton.propTypes = {
    id: PropTypes.string.isRequired
};

export default withJoyride(HelpButton);