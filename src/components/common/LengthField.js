import React from 'react';
import PropTypes from 'prop-types';
import MaskTextField from 'components/common/MaskTextField';

class LengthField extends React.Component {
    constructor(props) {
        super(props);

        this.maskTextFieldRef = React.createRef();

        this.focus = this.focus.bind(this);
        this.formatLength = this.formatLength.bind(this);
        this.parseLength = this.parseLength.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    focus() {
        this.maskTextFieldRef.current.focus();
    }

    formatLength(value) {
        if (typeof value === 'undefined' || value === null) {
            return null;
        }

        const minutes = Math.floor(value / 60).toString().padStart(2, '0');
        const seconds = (value % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    parseLength(value) {
        const tokens = value.split(':');
        return (Number(tokens[0]) * 60) + Number(tokens[1]);
    }

    onChange(value) {
        if (!value.match(/^[0-9]{2}:[0-9]{2}$/)) {
            return;
        }

        if (this.props.onChange) {
            this.props.onChange(this.parseLength(value));
        }
    }

    render() {
        const { length, readOnly, ...restProps } = this.props;
        delete restProps.onChange;

        const formattedLength = this.formatLength(length);

        if (readOnly) {
            return formattedLength ? formattedLength : (<span>&nbsp;</span>);
        }

        return (
            <MaskTextField
                ref={this.maskTextFieldRef}
                mask="11:11"
                value={formattedLength}
                onChange={e => this.onChange(e.target.value)}
                style={{ width: 100 }}
                {...restProps} />
        );
    }
}

LengthField.propTypes = {
    length: PropTypes.number,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool
};

export default LengthField;