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
        const wrappedProps = { ...this.props };
        wrappedProps.count = 1;
        wrappedProps.onChange = this.onChange;

        if ('defaultChecked' in wrappedProps) {
            wrappedProps.defaultValue = this.props.defaultChecked ? 1 : 0;
        }

        if ('checked' in wrappedProps) {
            wrappedProps.value = this.props.checked ? 1 : 0;
        }

        return (
            <Rate {...wrappedProps} />
        );
    }
}

StarCheckbox.propTypes = {
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default StarCheckbox;