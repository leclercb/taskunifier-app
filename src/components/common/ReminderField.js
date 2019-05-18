import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { toStringReminder } from 'utils/StringUtils';

class ReminderField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: null
        };

        this.toNumber = this.toNumber.bind(this);
        this.format = this.format.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    toNumber(value) {
        if (typeof value === 'undefined' || value === null) {
            return null;
        } else {
            return Number(value);
        }
    }

    format(value) {
        return toStringReminder(this.toNumber(value));
    }

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(this.toNumber(value));
        }
    }

    onSearch(value) {
        this.setState({
            search: this.toNumber(value)
        });
    }

    render() {
        const { ...restProps } = this.props;
        delete restProps.onChange;

        const defaultValues = [5, 10, 15, 30, 45, 60, 90, 120, 300, 720, 1440, 2880];

        if (this.state.search != null && !defaultValues.includes(this.state.search)) {
            defaultValues.push(this.state.search);
        }

        return (
            <Select
                allowClear={true}
                showSearch={true}
                onChange={this.onChange}
                onSearch={this.onSearch}
                {...restProps}>
                {defaultValues.map(value => (
                    <Select.Option key={String(value)} value={String(value)}>
                        {this.format(value)}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}

ReminderField.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func
};

export default ReminderField;