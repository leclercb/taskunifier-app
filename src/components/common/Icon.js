import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import Constants from 'constants/Constants';

function Icon(props) {
    return (
        <React.Fragment>
            <span
                onClick={props.onClick}
                className={props.globalClassName}
                style={props.globalStyle}>
                <FontAwesomeIcon
                    icon={props.icon}
                    onClick={props.onIconClick}
                    className={props.className}
                    style={{
                        fontSize: props.size ? props.size : undefined,
                        color: props.color ? props.color : Constants.color,
                        marginRight: props.text ? 10 : 0,
                        ...(props.style || {})
                    }} />
                {props.text}
            </span>
        </React.Fragment>
    );
}

Icon.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    text: PropTypes.node,
    globalStyle: PropTypes.object,
    globalClassName: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onIconClick: PropTypes.func
};

export default Icon;