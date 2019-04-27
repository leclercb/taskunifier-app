import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import ModalRepeatManager from 'components/repeat/ModalRepeatManager';

class RepeatField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true
        };
    }

    render() {
        return (
            <React.Fragment>
                <ModalRepeatManager
                    visible={this.state.visible}
                    onClose={() => this.props.onBlur()} />
                <Input
                    readOnly={true}
                    {...this.props} />
            </React.Fragment>
        );
    }
}

RepeatField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
};

export default RepeatField;