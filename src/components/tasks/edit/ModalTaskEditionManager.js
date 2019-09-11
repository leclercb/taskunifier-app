import React from 'react';
import { Button, Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import TaskEditionManager from 'components/tasks/edit/TaskEditionManager';
import withApp from 'containers/WithApp';
import { useTasks } from 'hooks/UseTasks';
import { getVisibleTask } from 'selectors/TaskSelectors';

function ModalTaskEditionManager(props) {
    const taskApi = useTasks();
    const task = useSelector(state => getVisibleTask(state, props.taskEditionManager.taskId));

    const onCloseTaskEditionManager = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            taskApi.updateTask({ ...task, ...values });
            props.form.resetFields();
            props.setTaskEditionManagerOptions({ visible: false });
        });
    };

    return (
        <Modal
            title={<Icon icon="tasks" text="Task Edition Manager" />}
            visible={props.taskEditionManager.visible}
            width="80%"
            closable={false}
            onOk={onCloseTaskEditionManager}
            onCancel={onCloseTaskEditionManager}
            footer={(
                <Button onClick={onCloseTaskEditionManager}>
                    Close
                </Button>
            )}>
            {!!task && (<TaskEditionManager form={props.form} task={task} />)}
        </Modal>
    );
}

ModalTaskEditionManager.propTypes = {
    form: PropTypes.object.isRequired,
    taskEditionManager: PropTypes.object.isRequired,
    setTaskEditionManagerOptions: PropTypes.func.isRequired
};

export default Form.create({ name: 'task' })(withApp(ModalTaskEditionManager));