import React from 'react';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import TaskTemplateManager from 'components/tasktemplates/TaskTemplateManager';
import { useApp } from 'hooks/UseApp';

function ModalTaskTemplateManager() {
    const appApi = useApp();

    const onCloseTaskTemplateManager = () => {
        appApi.setTaskTemplateManagerOptions({ visible: false });
    };

    const onTaskTemplateSelection = taskTemplateId => {
        appApi.setTaskTemplateManagerOptions({ taskTemplateId });
    };

    return (
        <Modal
            title={<Icon icon="tasks" text="Task Template Manager" />}
            visible={appApi.taskTemplateManager.visible}
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
                taskTemplateId={appApi.taskTemplateManager.taskTemplateId}
                onTaskTemplateSelection={onTaskTemplateSelection} />
        </Modal>
    );
}

export default ModalTaskTemplateManager;