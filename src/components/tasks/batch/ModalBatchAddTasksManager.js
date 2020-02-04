import React, { useRef } from 'react';
import { Button, Form, Modal } from 'antd';
import BatchAddTasksManager from 'components/tasks/batch/BatchAddTasksManager';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import { useAppApi } from 'hooks/UseAppApi';

function ModalBatchAddTasksManager() {
    const appApi = useAppApi();

    const [form] = Form.useForm();
    const managerRef = useRef();

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
                <React.Fragment>
                    <Button onClick={() => managerRef.current.addTasks()}>
                        <Icon icon="plus" text="Add tasks" />
                    </Button>
                    <Spacer />
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </React.Fragment>
            )}>
            <BatchAddTasksManager ref={managerRef} form={form} onSuccess={() => onClose()} />
        </Modal>
    );
}

export default ModalBatchAddTasksManager;