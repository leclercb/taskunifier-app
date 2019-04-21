import React from 'react';

function LeftRight(props) {
    return (
        <React.Fragment>
            <div style={{ width: "100%" }}>
                <div style={{ float: "left" }}>
                    {props.left ? props.left : props.children}
                </div>
                <div style={{ float: "right" }}>
                    {props.right}
                </div>
            </div>
            <div style={{ clear: "both" }}></div>
        </React.Fragment>
    );
}

export default LeftRight;