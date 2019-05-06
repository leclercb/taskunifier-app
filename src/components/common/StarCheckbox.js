import React from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';

class StarCheckbox extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        this.props.onChange(!!value);
    }

    render() {
        return (
            <Rate {...this.props} count={1} value={this.props.checked ? 1 : 0} onChange={this.onChange} />
        );
    }
}

StarCheckbox.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default StarCheckbox;