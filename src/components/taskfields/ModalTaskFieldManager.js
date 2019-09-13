import React from 'react';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import TaskFieldManager from 'components/taskfields/TaskFieldManager';
import { useAppApi } from 'hooks/UseAppApi';

function ModalTaskFieldManager() {
    const appApi = useAppApi();

    const onCloseTaskFieldManager = () => {
        appApi.setTaskFieldManagerOptions({ visible: false });
    };

    const onTaskFieldSelection = taskFieldId => {
        appApi.setTaskFieldManagerOptions({ taskFieldId });
    };

    return (
        <Modal
            title={<Icon icon="columns" text="Task Field Manager" />}
            visible={appApi.taskFieldManager.visible}
            width="80%"
            closable={false}
            onOk={onCloseTaskFieldManager}
            onCancel={onCloseTaskFieldManager}
            footer={(
                <Button onClick={onCloseTaskFieldManager}>
                    Close
                </Button>
            )}>
            <TaskFieldManager
                taskFieldId={appApi.taskFieldManager.taskFieldId}
                onTaskFieldSelection={onTaskFieldSelection} />
        </Modal>
    );
}

export default ModalTaskFieldManager;