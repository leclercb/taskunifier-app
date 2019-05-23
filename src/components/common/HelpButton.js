import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import withJoyride from 'containers/WithJoyride';

function HelpButton(props) {
    const onClick = () => {
        props.setJoyrideOptions({
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
    id: PropTypes.string.isRequired,
    setJoyrideOptions: PropTypes.func.isRequired
};

export default withJoyride(HelpButton);