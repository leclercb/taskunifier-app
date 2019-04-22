import React from 'react';
import RCColorPicker from 'rc-color-picker';

const ColorPicker = React.forwardRef(function ColorPicker(props, ref) {
    return (
        <RCColorPicker ref={ref} {...props} />
    );
});

export default ColorPicker;