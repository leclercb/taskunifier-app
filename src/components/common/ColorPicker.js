import React from 'react';
import RCColorPicker from 'rc-color-picker';

class ColorPicker extends React.Component {
    render() {
        return (
            <RCColorPicker {...this.props} />
        );
    }
}

export default ColorPicker;