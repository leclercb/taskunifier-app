import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Constants from 'constants/Constants';

function Icon(props) {
    return (
        <React.Fragment>
            <span onClick={props.onClick}>
                <FontAwesomeIcon
                    icon={props.icon}
                    className={props.className}
                    style={{
                        color: props.color ? props.color : Constants.color,
                        marginRight: props.text ? 10 : 0,
                        ...(props.style || {})
                    }} />
            </span>
            {props.text}
        </React.Fragment>
    );
}

Icon.propTypes = {
    icon: PropTypes.string.isRequired,
    color: PropTypes.string,
    text: PropTypes.node,
    style: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default Icon;