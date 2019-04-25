import React from 'react';
import PropTypes from 'prop-types';

function Spacer(props) {
    return (
        <span style={{ marginRight: props.size ? props.size : 10 }}>&nbsp;</span>
    );
}

Spacer.propTypes = {
    size: PropTypes.number
};

export default Spacer;