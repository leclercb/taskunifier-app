import React from 'react';
import PropTypes from 'prop-types';

function Logo(props) {
    return (
        <img alt="Logo" src="/resources/images/logo.png" style={{ width: props.size, height: props.size }} />
    );
}

Logo.propTypes = {
    size: PropTypes.number
};

export default Logo;