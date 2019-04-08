import React from 'react';
import { Modal } from 'antd';
import withStatus from '../../containers/WithStatus';
import Status from './Status';
import Icon from '../common/Icon';

function ModalStatus(props) {
    return (
        <Modal
            title={<Icon icon="cogs" text="Progress" />}
            visible={props.status.busy}
            closable={false}
            footer={null}>
            <Status />
        </Modal>
    );
}

export default withStatus(ModalStatus);