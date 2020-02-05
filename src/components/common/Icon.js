import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import Constants from 'constants/Constants';

function Icon({ icon, size, color, text, children, globalStyle, globalClassName, style, className, onClick, onIconClick }) {
    return (
        <React.Fragment>
            <span
                onClick={onClick}
                className={globalClassName}
                style={globalStyle}>
                <FontAwesomeIcon
                    icon={icon}
                    onClick={onIconClick}
                    className={(className || '') + (color ? '' : ' colorable')}
                    style={{
                        fontSize: size ? size : undefined,
                        color: color ? color : Constants.color,
                        marginRight: text || children ? 10 : 0,
                        ...(style || {})
                    }} />
                {text ? text : children}
            </span>
        </React.Fragment>
    );
}

Icon.propTypes = {
    icon: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    ]).isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    text: PropTypes.node,
    children: PropTypes.node,
    globalStyle: PropTypes.object,
    globalClassName: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onIconClick: PropTypes.func
};

export default Icon;