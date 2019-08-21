import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import MaskTextField from 'components/common/MaskTextField';
import Spacer from 'components/common/Spacer';
import { TimerPropType } from 'proptypes/TimerPropTypes';
import { toStringDuration } from 'utils/StringUtils';

class TimerField extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();

        this.focus = this.focus.bind(this);
        this.formatDuration = this.formatDuration.bind(this);
        this.parseDuration = this.parseDuration.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    focus() {
        this.inputRef.current.focus();
    }

    formatDuration(value) {
        return toStringDuration(value);
    }

    parseDuration(match) {
        let value = 0;

        if (match[1]) {
            value += Number(match[1]) * 86400;
        }

        if (match[2]) {
            value += Number(match[2]) * 3600;
        }

        if (match[3]) {
            value += Number(match[3]) * 60;
        }

        return value;
    }

    onClick() {
        const { timer } = this.props;
        const value = timer ? timer.value : 0;
        const startDate = timer ? timer.startDate : null;
        const newTimer = {};

        if (startDate) {
            newTimer.value = value + moment().diff(moment(startDate), 'seconds');
            newTimer.startDate = null;
        } else {
            newTimer.value = value;
            newTimer.startDate = moment().toISOString();
        }

        if (this.props.onChange) {
            this.props.onChange(newTimer);
        }
    }

    onChange(value) {
        const match = value.match(/^([0-9]{2})d ([0-9]{2})h([0-9]{2})m$/);

        if (!match) {
            return;
        }

        if (this.props.onChange) {
            this.props.onChange({
                value: this.parseDuration(match),
                startDate: this.props.timer && this.props.timer.startDate ? moment().toISOString() : null
            });
        }
    }

    render() {
        const timer = this.props.timer || {
            value: 0,
            startDate: null
        };

        const formattedDuration = this.formatDuration(timer.value);

        const restProps = { ...this.props };
        delete restProps.timer;
        delete restProps.onStartStop;
        delete restProps.onChange;
        delete restProps.readOnly;

        const { readOnly } = this.props;

        return (
            <React.Fragment>
                <Icon
                    icon={timer.startDate ? 'pause' : 'play'}
                    style={{ cursor: 'pointer' }}
                    onIconClick={this.onClick}
                    text={readOnly ? formattedDuration : null} />
                {!readOnly && (
                    <React.Fragment>
                        <Spacer />
                        <MaskTextField
                            ref={this.inputRef}
                            mask="11d 11h11m"
                            value={formattedDuration}
                            onChange={e => this.onChange(e.target.value)}
                            style={{ width: 100 }}
                            {...restProps} />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

TimerField.propTypes = {
    timer: TimerPropType,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool
};

export default TimerField;