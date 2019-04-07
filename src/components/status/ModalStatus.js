import React from 'react';
import { Button, Modal } from 'antd';
import withStatus from '../../containers/WithStatus';
import Status from './Status';
import Icon from '../common/Icon';

function ModalStatus(props) {
    const onOk = () => {
        props.setStatusVisible(false);
    }

    return (
        <Modal
            title={<Icon icon="cogs" text="Status" />}
            visible={props.status.visible}
            closable={false}
            onOk={onOk}
            footer={
                <Button key="submit" onClick={onOk}>
                    Close
                </Button>
            }>
            <Status />
        </Modal>
    );
}

export default withStatus(ModalStatus);