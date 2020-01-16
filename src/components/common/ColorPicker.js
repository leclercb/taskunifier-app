import React from 'react';
import { Popover } from 'antd';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.onChange = this.onChange.bind(this);
        this.onVisibleChange = this.onVisibleChange.bind(this);
    }

    onChange(color) {
        if (this.props.onChange) {
            this.props.onChange(color.hex);
        }
    }

    onVisibleChange(visible) {
        if (this.props.disabled) {
            return;
        }

        this.setState({ visible });

        if (!visible && this.props.onClose) {
            this.props.onClose();
        }
    }

    render() {
        return (
            <Popover
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.onVisibleChange}
                content={(
                    <SketchPicker
                        disableAlpha={true}
                        {...this.props.pickerProps}
                        color={this.props.color}
                        onChange={this.onChange} />
                )}>
                <button
                    className="color-picker"
                    {...this.props.buttonProps}
                    style={{
                        ...(this.props.buttonProps ? this.props.buttonProps.style : null),
                        backgroundColor: this.props.color,
                        cursor: this.props.disabled ? 'not-allowed' : 'pointer'
                    }} />
            </Popover>
        );
    }
}

ColorPicker.propTypes = {
    color: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    buttonProps: PropTypes.object,
    pickerProps: PropTypes.object
};

export default ColorPicker;