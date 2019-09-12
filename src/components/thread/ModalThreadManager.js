import React from 'react';
import { Button, Modal } from 'antd';
import ProcessList from 'components/thread/ProcessList';
import Icon from 'components/common/Icon';
import { useThreads } from 'hooks/UseThreads';

function ModalThreadManager() {
    const threadApi = useThreads();

    const onClose = () => {
        threadApi.setThreadManagerVisible(false);
    };

    return (
        <Modal
            title={<Icon icon="cogs" text="Progress" />}
            visible={threadApi.threadManagerVisible}
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <Button onClick={onClose}>
                    Close
                </Button>
            )}>
            <ProcessList processes={threadApi.processes} />
        </Modal>
    );
}

export default ModalThreadManager;