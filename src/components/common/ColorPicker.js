import React from 'react';
import PropTypes from 'prop-types';
import RCColorPicker from 'rc-color-picker';

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        if (this.props.onChange) {
            this.props.onChange(event.color);
        }
    }

    render() {
        return (
            <RCColorPicker {...this.props} onChange={this.onChange} />
        );
    }
}

ColorPicker.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default ColorPicker;