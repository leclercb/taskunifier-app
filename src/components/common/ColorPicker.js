import React from 'react';
import RCColorPicker from 'rc-color-picker';

const ColorPicker = React.forwardRef((props, ref) => {
    return (
        <RCColorPicker ref={ref} {...props} />
    );
});

export default ColorPicker;