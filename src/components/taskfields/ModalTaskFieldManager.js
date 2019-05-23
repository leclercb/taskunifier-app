import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import TaskFieldManager from 'components/taskfields/TaskFieldManager';

function ModalTaskFieldManager(props) {
    const onCloseTaskFieldManager = () => {
        props.setTaskFieldManagerOptions({ visible: false });
    };

    const onTaskFieldSelection = taskFieldId => {
        props.setTaskFieldManagerOptions({ taskFieldId });
    };

    return (
        <Modal
            title={<Icon icon="columns" text="Task Field Manager" />}
            visible={props.taskFieldManager.visible}
            width="80%"
            closable={false}
            footer={(
                <Button onClick={onCloseTaskFieldManager}>
                    Close
                </Button>
            )}>
            <TaskFieldManager
                taskFieldId={props.taskFieldManager.taskFieldId}
                onTaskFieldSelection={onTaskFieldSelection} />
        </Modal>
    );
}

ModalTaskFieldManager.propTypes = {
    taskFieldManager: PropTypes.object.isRequired,
    setTaskFieldManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalTaskFieldManager);