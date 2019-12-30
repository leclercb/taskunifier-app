import React from 'react';
import { Popover } from 'antd';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onVisibleChange = this.onVisibleChange.bind(this);
    }

    onChange(color) {
        if (this.props.onChange) {
            this.props.onChange(color.hex);
        }
    }

    onVisibleChange(visible) {
        if (!visible && this.props.onClose) {
            this.props.onClose();
        }
    }

    render() {
        return (
            <Popover
                trigger="click"
                onVisibleChange={this.onVisibleChange}
                content={(
                    <SketchPicker {...this.props} onChange={this.onChange} />
                )}>
                <button
                    className="color-picker"
                    style={{ backgroundColor: this.props.color }} />
            </Popover>
        );
    }
}

ColorPicker.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
    onClose: PropTypes.func
};

export default ColorPicker;