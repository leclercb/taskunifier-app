import React from 'react';

function LeftRight(props) {
    return (
        <React.Fragment>
            <div>
                <p style={{ float: "left" }}>{props.left ? props.left : props.children}</p>
                <p style={{ float: "right" }}>{props.right}</p>
            </div>
            <div style={{ clear: "both" }}></div>
        </React.Fragment>
    );
}

export default LeftRight;