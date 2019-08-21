import React from 'react';
import PropTypes from 'prop-types';

function LeftRight(props) {
    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div
                onClick={props.onClickLeft}
                style={{ flexGrow: 1 }}>
                {props.left ? props.left : props.children}
            </div>
            <div
                onClick={props.onClickRight}>
                {props.right}
            </div>
        </div>
    );
}

LeftRight.propTypes = {
    left: PropTypes.node,
    right: PropTypes.node,
    children: PropTypes.node,
    onClickLeft: PropTypes.func,
    onClickRight: PropTypes.func
};

export default LeftRight;