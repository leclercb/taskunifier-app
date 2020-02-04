import React from 'react';
import { Button, Form, Modal } from 'antd';
import Icon from 'components/common/Icon';
import TaskEditionManager from 'components/tasks/edit/TaskEditionManager';
import { useAppApi } from 'hooks/UseAppApi';
import { useTask } from 'hooks/UseTask';
import { useTaskApi } from 'hooks/UseTaskApi';

function ModalTaskEditionManager() {
    const appApi = useAppApi();
    const taskApi = useTaskApi();
    const task = useTask(appApi.taskEditionManager.taskId);

    const [form] = Form.useForm();

    const onCloseTaskEditionManager = async () => {
        try {
            const values = await form.validateFields();

            taskApi.updateTask({ ...task, ...values });
            form.resetFields();
            appApi.setTaskEditionManagerOptions({ visible: false });
        } catch (error) {
            // Skip
        }
    };

    return (
        <Modal
            title={<Icon icon="tasks" text="Task Edition Manager" />}
            visible={appApi.taskEditionManager.visible}
            width="80%"
            closable={false}
            onOk={onCloseTaskEditionManager}
            onCancel={onCloseTaskEditionManager}
            footer={(
                <Button onClick={onCloseTaskEditionManager}>
                    Close
                </Button>
            )}>
            {!!task && (<TaskEditionManager form={form} task={task} />)}
        </Modal>
    );
}

export default ModalTaskEditionManager;