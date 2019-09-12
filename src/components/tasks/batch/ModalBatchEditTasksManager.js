import React from 'react';
import { Button, Modal } from 'antd';
import BatchEditTasksManager from 'components/tasks/batch/BatchEditTasksManager';
import Icon from 'components/common/Icon';
import { useApp } from 'hooks/UseApp';

function ModalBatchEditTasksManager() {
    const appApi = useApp();

    const onClose = () => {
        appApi.setBatchEditTasksManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="magic" text="Batch Edit Tasks" />}
            visible={appApi.batchEditTasksManager.visible}
            width="80%"
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <Button onClick={onClose}>
                    Close
                </Button>
            )}>
            <BatchEditTasksManager onEdit={() => onClose()} />
        </Modal>
    );
}

export default ModalBatchEditTasksManager;