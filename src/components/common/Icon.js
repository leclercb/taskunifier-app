import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Constants from 'constants/Constants';

function Icon(props) {
    return (
        <span onClick={props.onClick} className={props.spanClassName}>
            <FontAwesomeIcon
                icon={props.icon}
                className={props.className}
                style={{
                    color: props.color ? props.color : Constants.color,
                    marginRight: props.text ? 10 : 0,
                    ...(props.style || {})
                }} />
            {props.text}
        </span>
    );
}

Icon.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
    style: PropTypes.object,
    spanClassName: PropTypes.string,
    onClick: PropTypes.func
};

export default Icon;