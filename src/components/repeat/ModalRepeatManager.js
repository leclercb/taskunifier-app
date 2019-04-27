import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import RepeatManager from 'components/repeat/RepeatManager';

function ModalRepeatManager(props) {
    const onClose = () => {
        props.onClose();
    };

    return (
        <Modal
            title={<Icon icon="retweet" text="Repeat Manager" />}
            visible={props.visible}
            width="60%"
            closable={false}
            footer={
                <Button onClick={onClose}>
                    Close
                </Button>
            }>
            <RepeatManager repeat={props.repeat} onUpdateRepeat={props.onUpdateRepeat} />
        </Modal>
    );
}

ModalRepeatManager.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    repeat: PropTypes.object.isRequired,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default ModalRepeatManager;