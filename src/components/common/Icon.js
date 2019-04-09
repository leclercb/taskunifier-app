import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Icon(props) {
    return (
        <span onClick={props.onClick}>
            <FontAwesomeIcon icon={props.icon} className={props.className} style={{ color: props.color ? props.color : "#008c4b", marginRight: 10 }} />
            {props.text}
        </span>
    );
}

export default Icon;