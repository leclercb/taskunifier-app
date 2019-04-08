import React from 'react';

function Spacer(props) {
    return (
        <span style={{ marginRight: props.size ? props.size : 10 }}>&nbsp;</span>
    );
}

export default Spacer;