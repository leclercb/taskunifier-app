import React from 'react';
import { Button, Modal } from 'antd';
import BatchAddTasksManager from 'components/tasks/batch/BatchAddTasksManager';
import Icon from 'components/common/Icon';
import { useApp } from 'hooks/UseApp';

function ModalBatchAddTasksManager() {
    const appApi = useApp();

    const onClose = () => {
        appApi.setBatchAddTasksManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="magic" text="Batch Add Tasks" />}
            visible={appApi.batchAddTasksManager.visible}
            width="80%"
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <Button onClick={onClose}>
                    Close
                </Button>
            )}>
            <BatchAddTasksManager onAdd={() => onClose()} />
        </Modal>
    );
}

export default ModalBatchAddTasksManager;