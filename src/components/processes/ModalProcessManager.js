import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withProcesses from 'containers/WithProcesses';
import ProcessList from 'components/processes/ProcessList';
import Icon from 'components/common/Icon';

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

ModalProcessManager.propTypes = {
    processes: PropTypes.array.isRequired,
    setProcessesVisible: PropTypes.func.isRequired
};

export default withProcesses(ModalProcessManager);