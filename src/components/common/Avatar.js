import React from 'react';
import PropTypes from 'prop-types';

function Avatar(props) {
    return (
        <img
            alt="Avatar"
            src="resources/images/avatar.png"
            style={{
                ...props.style,
                width: props.size,
                height: props.size
            }} />
    );
}

Avatar.propTypes = {
    size: PropTypes.number,
    style: PropTypes.object
};

export default Avatar;