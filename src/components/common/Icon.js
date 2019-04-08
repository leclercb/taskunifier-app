import React from 'react';

function Icon(props) {
    return (
        <span onClick={props.onClick}>
            <i
                className={"fas fa-" + props.icon + " " + props.className}
                style={{ color: props.color ? props.color : "#20639b", marginRight: 10 }}></i>
            {props.text}
        </span>
    );
}

export default Icon;