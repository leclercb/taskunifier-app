import React from 'react';
import { Button, Modal } from 'antd';
import withProcesses from 'containers/WithProcesses';
import ProcessList from 'components/processes/ProcessList';
import Icon from '../common/Icon';

function ModalProcessManager(props) {
    const onOk = () => {
        props.setProcessesVisible(false);
    };

    return (
        <Modal
            title={<Icon icon="cogs" text="Progress" />}
            visible={props.processes.visible}
            closable={false}
            footer={
                <Button onClick={onOk}>
                    Close
                </Button>
            }>
            <ProcessList />
        </Modal>
    );
}

export default withProcesses(ModalProcessManager);