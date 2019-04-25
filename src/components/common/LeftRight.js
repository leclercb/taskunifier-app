import React from 'react';
import PropTypes from 'prop-types';

function LeftRight(props) {
    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
                <div style={{ float: 'left' }}>
                    {props.left ? props.left : props.children}
                </div>
                <div style={{ float: 'right' }}>
                    {props.right}
                </div>
            </div>
            <div style={{ clear: 'both' }}></div>
        </React.Fragment>
    );
}

LeftRight.propTypes = {
    left: PropTypes.node,
    right: PropTypes.node,
    children: PropTypes.node
}

export default LeftRight;