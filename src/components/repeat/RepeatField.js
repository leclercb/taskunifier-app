import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import ModalRepeatManager from 'components/repeat/ModalRepeatManager';
import { formatRepeat, getKeysForType } from 'utils/RepeatUtils';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

class RepeatField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.setVisible = this.setVisible.bind(this);
    }

    setVisible(visible) {
        if (this.state.visible !== visible) {
            this.setState({
                visible
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <ModalRepeatManager
                    visible={this.props.fieldmode === 'table' ? true : this.state.visible}
                    onClose={() => {
                        this.setVisible(false);

                        if (this.props.onBlur) {
                            this.props.onBlur();
                        }
                    }}
                    repeat={this.props.repeat || { type: 'none' }}
                    updateRepeat={repeat => {
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
                    onClick={() => {
                        if (this.props.fieldmode !== 'table') {
                            this.setVisible(true);
                        }
                    }}
                    {...this.props}
                    value={formatRepeat(this.props.repeat)} />
            </React.Fragment>
        );
    }
}

RepeatField.propTypes = {
    repeat: RepeatPropType,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    fieldmode: PropTypes.oneOf(['default', 'table'])
};

export default RepeatField;