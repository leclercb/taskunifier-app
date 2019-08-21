import React from 'react';
import PropTypes from 'prop-types';
import MaskTextField from 'components/common/MaskTextField';
import { toStringDuration } from 'utils/StringUtils';

class DurationField extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();

        this.focus = this.focus.bind(this);
        this.formatDuration = this.formatDuration.bind(this);
        this.parseDuration = this.parseDuration.bind(this);
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

    onChange(value) {
        const match = value.match(/^([0-9]{2})d ([0-9]{2})h([0-9]{2})m$/);

        if (!match) {
            return;
        }

        if (this.props.onChange) {
            this.props.onChange(this.parseDuration(match));
        }
    }

    render() {
        const { duration, readOnly, ...restProps } = this.props;
        delete restProps.onChange;

        const formattedDuration = this.formatDuration(duration);

        if (readOnly) {
            return formattedDuration ? formattedDuration : (<span>&nbsp;</span>);
        }

        return (
            <MaskTextField
                ref={this.inputRef}
                mask="11d 11h11m"
                value={formattedDuration}
                onChange={e => this.onChange(e.target.value)}
                {...restProps} />
        );
    }
}

DurationField.propTypes = {
    duration: PropTypes.number,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool
};

export default DurationField;