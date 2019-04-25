import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import MaskTextField from 'components/common/MaskTextField';

class TimerField extends React.Component {
    constructor(props) {
        super(props);

        this.formatTime = this.formatTime.bind(this);
        this.parseTime = this.parseTime.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    formatTime(value) {
        const minutes = Math.floor(value / 60).toString().padStart(2, "0");
        const seconds = (value % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    parseTime(value) {
        const tokens = value.split(':');
        return (tokens[0] * 60) + tokens[1];
    }

    onClick() {
        const value = this.props.timer ? this.props.timer.value : 0;
        const startDate = this.props.timer ? this.props.timer.startDate : null;
        const timer = {};

        if (startDate) {
            timer.value = value + moment().diff(moment(startDate), 'seconds');
            timer.startDate = null;
        } else {
            timer.value = value;
            timer.startDate = moment().toJSON();
        }

        console.log(timer);
        this.props.onChange(timer);
    }

    onChange(value) {
        console.log(value);

        if (!value.match(/^[0-9]{2}:[0-9]{2}$/)) {
            return;
        }

        const timer = {
            value: this.parseTime(value),
            startDate: this.props.timer && this.props.timer.startDate ? moment().toJSON() : null
        };

        //this.props.onChange(timer);
    }

    render() {
        console.log(this.props.timer);

        const timer = this.props.timer || {
            value: 0,
            startDate: null
        }

        return (
            <React.Fragment>
                <Icon
                    icon={timer.startDate ? 'pause' : 'play'}
                    style={{ cursor: 'pointer' }}
                    onClick={this.onClick}
                    text={this.props.readOnly ? this.formatTime(timer.value) : null} />
                {!this.props.readOnly &&
                    <MaskTextField
                        mask="11:11"
                        value={this.formatTime(timer.value)}
                        onChange={e => this.onChange(e.target.value)} />
                }
            </React.Fragment>
        );
    }
}

TimerField.propTypes = {
    timer: PropTypes.shape({
        value: PropTypes.number.isRequired,
        startDate: PropTypes.string
    }),
    onChange: PropTypes.func,
    readOnly: PropTypes.bool
};

export default TimerField;