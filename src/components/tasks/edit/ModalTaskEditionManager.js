import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import TaskEditionManager from 'components/tasks/edit/TaskEditionManager';

function ModalTaskEditionManager(props) {
    const onCloseTaskEditionManager = () => {
        props.setTaskEditionManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="tasks" text="Task Edition Manager" />}
            visible={props.taskEditionManager.visible}
            width="80%"
            closable={false}
            footer={
                <Button onClick={onCloseTaskEditionManager}>
                    Close
                </Button>
            }>
            <TaskEditionManager taskId={props.taskEditionManager.taskId} />
        </Modal>
    );
}

ModalTaskEditionManager.propTypes = {
    taskEditionManager: PropTypes.object.isRequired,
    setTaskEditionManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalTaskEditionManager);