import React from 'react';

function Icon(props) {
    return (
        <i className={"fas fa-" + props.icon} style={{ marginRight: 10 }}></i>
    );
}

export default Icon;