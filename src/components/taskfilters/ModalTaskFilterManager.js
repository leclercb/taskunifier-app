import React from 'react';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import TaskFilterManager from 'components/taskfilters/TaskFilterManager';
import { useAppApi } from 'hooks/UseAppApi';

function ModalTaskFilterManager() {
    const appApi = useAppApi();

    const onCloseTaskFilterManager = () => {
        appApi.setTaskFilterManagerOptions({ visible: false });
    };

    const onTaskFilterSelection = taskFilterId => {
        appApi.setTaskFilterManagerOptions({ taskFilterId });
    };

    return (
        <Modal
            title={<Icon icon="filter" text="Task Filter Manager" />}
            visible={appApi.taskFilterManager.visible}
            width="80%"
            closable={false}
            onOk={onCloseTaskFilterManager}
            onCancel={onCloseTaskFilterManager}
            footer={(
                <Button onClick={onCloseTaskFilterManager}>
                    Close
                </Button>
            )}>
            <TaskFilterManager
                taskFilterId={appApi.taskFilterManager.taskFilterId}
                onTaskFilterSelection={onTaskFilterSelection} />
        </Modal>
    );
}

export default ModalTaskFilterManager;