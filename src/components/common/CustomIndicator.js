import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'components/common/Logo';

function CustomIndicator({ content }) {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        }}>
            <Logo size={120} />
            <br />
            <br />
            <br />
            {content}
        </div>
    );
}

CustomIndicator.propTypes = {
    content: PropTypes.node
};

export default CustomIndicator;