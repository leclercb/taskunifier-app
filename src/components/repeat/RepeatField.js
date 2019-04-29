import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import ModalRepeatManager from 'components/repeat/ModalRepeatManager';

class RepeatField extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ModalRepeatManager
                    visible={true}
                    onClose={() => this.props.onBlur()}
                    repeat={this.props.repeat}
                    onUpdateRepeat={repeat =>{this.props.onChange(repeat); console.log('changed', repeat)}} />
                <Input
                    readOnly={true}
                    {...this.props} />
            </React.Fragment>
        );
    }
}

RepeatField.propTypes = {
    repeat: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
};

export default RepeatField;