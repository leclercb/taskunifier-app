import React from 'react';
import RCColorPicker from 'rc-color-picker';

function ColorPicker(props, ref) {
    return (
        <RCColorPicker ref={ref} {...props} />
    );
};

export default React.forwardRef(ColorPicker);