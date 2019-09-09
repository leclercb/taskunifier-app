import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import RepeatForm from 'components/repeat/RepeatForm';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';

function ModalRepeatManager(props) {
    const onDoNotRepeat = () => {
        props.updateRepeat(null);
        props.onClose();
    };

    const onClose = () => {
        props.onClose();
    };

    return (
        <Modal
            title={<Icon icon="retweet" text="Repeat Manager" />}
            visible={props.visible}
            width="60%"
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <React.Fragment>
                    <Button onClick={onDoNotRepeat}>Do Not Repeat</Button>
                    <Spacer />
                    <Button onClick={onClose}>Close</Button>
                </React.Fragment>
            )}>
            <RepeatForm repeat={props.repeat} updateRepeat={props.updateRepeat} />
        </Modal>
    );
}

ModalRepeatManager.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default ModalRepeatManager;