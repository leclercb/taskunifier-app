import React from 'react';

function Logo(props) {
    return (
        <img src="/resources/images/logo.png" style={{ width: props.size, height: props.size }} />
    );
}

export default Logo;