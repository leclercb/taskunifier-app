import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import ModalRepeatManager from 'components/repeat/ModalRepeatManager';
import { getKeysForType } from 'utils/RepeatUtils';

class RepeatField extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ModalRepeatManager
                    visible={true}
                    onClose={() => this.props.onBlur()}
                    repeat={this.props.repeat || { type: 'none' }}
                    onUpdateRepeat={repeat => {
                        const keys = getKeysForType(repeat.type);

                        Object.keys(repeat).forEach(key => {
                            if (key !== 'type' && !keys.includes(key)) {
                                delete repeat[key];
                            }
                        });

                        this.props.onChange(repeat);
                    }} />
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