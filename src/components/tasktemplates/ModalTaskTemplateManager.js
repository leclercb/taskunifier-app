import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import TaskTemplateManager from 'components/tasktemplates/TaskTemplateManager';

function ModalTaskTemplateManager(props) {
    const onCloseTaskTemplateManager = () => {
        props.setTaskTemplateManagerOptions({ visible: false });
    };

    const onTaskTemplateSelection = taskTemplateId => {
        props.setTaskTemplateManagerOptions({ taskTemplateId });
    };

    return (
        <Modal
            title={<Icon icon="tasks" text="Task Template Manager" />}
            visible={props.taskTemplateManager.visible}
            width="80%"
            closable={false}
            onOk={onCloseTaskTemplateManager}
            onCancel={onCloseTaskTemplateManager}
            footer={(
                <Button onClick={onCloseTaskTemplateManager}>
                    Close
                </Button>
            )}>
            <TaskTemplateManager
                taskTemplateId={props.taskTemplateManager.taskTemplateId}
                onTaskTemplateSelection={onTaskTemplateSelection} />
        </Modal>
    );
}

ModalTaskTemplateManager.propTypes = {
    taskTemplateManager: PropTypes.object.isRequired,
    setTaskTemplateManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalTaskTemplateManager);