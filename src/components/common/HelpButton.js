import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useJoyrideApi } from 'hooks/UseJoyrideApi';

function HelpButton({ id }) {
    const joyrideApi = useJoyrideApi();

    const onClick = () => {
        joyrideApi.setJoyrideOptions({
            id,
            run: true,
            stepIndex: 0
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

export default HelpButton;