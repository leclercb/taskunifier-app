import React from 'react';
import { DatePicker as AntDatePicker, Button } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'components/common/DatePicker.css';

class DatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: props.defaultOpened === true
        };

        this.onChange = this.onChange.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.setDate = this.setDate.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.defaultOpened !== prevProps.defaultOpened) {
            this.setState({ open: this.props.defaultOpened });
        }
    }

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(value ? value.toISOString() : null);
        }
    }

    onOpenChange(status) {
        this.setState({ open: status });

        if (this.props.onOpenChange) {
            this.props.onOpenChange(status);
        }
    }

    setDate(value) {
        this.onChange(value);
        this.onOpenChange(false);
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
                onChange={this.onChange}
                open={this.state.open}
                onOpenChange={this.onOpenChange}
                renderExtraFooter={() => (
                    <React.Fragment>
                        <Button
                            type="link"
                            size="small"
                            className="datepicker-button first"
                            onClick={() => this.setDate(moment().add(1, 'day'))}>
                            Tomorrow
                        </Button>
                        <span>-</span>
                        <Button
                            type="link"
                            size="small"
                            className="datepicker-button"
                            onClick={() => this.setDate(moment().add(3, 'day'))}>
                            3 days
                        </Button>
                        <span>-</span>
                        <Button
                            type="link"
                            size="small"
                            className="datepicker-button"
                            onClick={() => this.setDate(moment().add(1, 'week'))}>
                            1 week
                        </Button>
                        <span>-</span>
                        <Button
                            type="link"
                            size="small"
                            className="datepicker-button last"
                            onClick={() => this.setDate(moment().add(1, 'month'))}>
                            1 month
                        </Button>
                    </React.Fragment>
                )} />
        );
    }
}

DatePicker.propTypes = {
    defaultOpened: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onOpenChange: PropTypes.func
};

export default DatePicker;