import React from 'react';

function Icon(props) {
    return (
        <span>
            <i
                className={"fas fa-" + props.icon}
                style={{ color: props.color ? props.color : "#20639b", marginRight: 10 }}></i>
            {props.text}
        </span>
    );
}

export default Icon;