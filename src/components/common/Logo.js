import React from 'react';
import PropTypes from 'prop-types';

function Logo({ alt, size, style }) {
    return (
        <img
            alt="Logo"
            src={`resources/images/logo${alt ? '_alt' : ''}.png`}
            style={{
                ...style,
                width: size,
                height: size
            }} />
    );
}

Logo.propTypes = {
    alt: PropTypes.bool,
    size: PropTypes.number,
    style: PropTypes.object
};

export default Logo;