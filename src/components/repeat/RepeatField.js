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
            opened: props.defaultOpened
        };

        this.setOpened = this.setOpened.bind(this);
    }

    setOpened(opened) {
        if (this.state.opened !== opened) {
            this.setState({
                opened
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.defaultOpened !== prevProps.defaultOpened) {
            this.setOpened(this.props.defaultOpened);
        }
    }

    render() {
        const { repeat, onChange, onOpenChange, ...wrappedProps } = this.props;
        delete wrappedProps.defaultOpened;

        return (
            <React.Fragment>
                <ModalRepeatManager
                    visible={this.state.opened}
                    onClose={() => {
                        this.setOpened(false);

                        if (onOpenChange) {
                            onOpenChange(false);
                        }
                    }}
                    repeat={repeat || { type: 'none' }}
                    updateRepeat={repeat => {
                        const keys = getKeysForType(repeat.type);

                        Object.keys(repeat).forEach(key => {
                            if (key !== 'type' && !keys.includes(key)) {
                                delete repeat[key];
                            }
                        });

                        onChange(repeat);
                    }} />
                <Input
                    {...wrappedProps}
                    readOnly={true}
                    value={formatRepeat(repeat)}
                    onClick={() => {
                        this.setOpened(true);

                        if (onOpenChange) {
                            onOpenChange(true);
                        }
                    }} />
            </React.Fragment>
        );
    }
}

RepeatField.propTypes = {
    repeat: RepeatPropType,
    defaultOpened: PropTypes.bool,
    onChange: PropTypes.func,
    onOpenChange: PropTypes.func,
    fieldMode: PropTypes.oneOf(['default', 'table'])
};

RepeatField.defaultProps = {
    defaultOpened: false
}

export default RepeatField;