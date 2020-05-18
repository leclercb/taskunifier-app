import React from 'react';
import { Button, Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import TaskEditionManager from 'components/tasks/edit/TaskEditionManager';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';
import { useTask } from 'hooks/UseTask';
import { useTaskApi } from 'hooks/UseTaskApi';

function ModalTaskEditionManager({ apis }) {
    const { appApi, taskApi } = apis;
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

ModalTaskEditionManager.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(ModalTaskEditionManager, () => ({
    appApi: useAppApi(),
    taskApi: useTaskApi()
}));