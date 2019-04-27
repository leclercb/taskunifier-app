import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import TaskFilterManager from 'components/taskfilters/TaskFilterManager';

function ModalRepeatManager(props) {
    const onClose = () => {
        props.onClose();
    };

    return (
        <Modal
            title={<Icon icon="retweet" text="Repeat Manager" />}
            visible={props.visible}
            width="80%"
            closable={false}
            footer={
                <Button onClick={onClose}>
                    Close
                </Button>
            }>

        </Modal>
    );
}

ModalRepeatManager.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ModalRepeatManager;