import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DatePicker as AntDatePicker } from 'antd';

class DatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(value ? value.toISOString() : null);
        }
    }

    render() {
        let { value, ...wrappedProps } = this.props;

        if (value) {
            value = moment(value);
        }

        return (
            <AntDatePicker
                {...wrappedProps}
                value={value}
                onChange={this.onChange} />
        );
    }
}

DatePicker.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default DatePicker;