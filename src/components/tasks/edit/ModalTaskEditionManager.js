import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'antd';
import Icon from 'components/common/Icon';
import TaskEditionManager from 'components/tasks/edit/TaskEditionManager';
import withApp from 'containers/WithApp';
import withTask from 'containers/WithTask';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function ModalTaskEditionManager(props) {
    const onCloseTaskEditionManager = () => {
        props.form.validateFields((error, values) => {
            if (error) {
                return;
            }

            props.updateTask({ ...props.task, ...values });
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
            footer={(
                <Button onClick={onCloseTaskEditionManager}>
                    Close
                </Button>
            )}>
            {props.task && <TaskEditionManager form={props.form} task={props.task} />}
        </Modal>
    );
}

ModalTaskEditionManager.propTypes = {
    form: PropTypes.object.isRequired,
    task: TaskPropType,
    updateTask: PropTypes.func.isRequired,
    taskEditionManager: PropTypes.object.isRequired,
    setTaskEditionManagerOptions: PropTypes.func.isRequired
};

export default Form.create({ name: 'task' })(withApp(withTask(
    ModalTaskEditionManager,
    ownProps => ownProps.taskEditionManager.taskId)));