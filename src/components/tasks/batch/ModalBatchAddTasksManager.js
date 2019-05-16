import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import BatchAddTasksManager from 'components/tasks/batch/BatchAddTasksManager';
import Icon from 'components/common/Icon';

function ModalBatchAddTasksManager(props) {
    const onClose = () => {
        props.setBatchAddTasksManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="magic" text="Batch Add Tasks" />}
            visible={props.batchAddTasksManager.visible}
            width="80%"
            closable={false}
            footer={(
                <Button onClick={onClose}>
                    Close
                </Button>
            )}>
            <BatchAddTasksManager onAdd={() => onClose()} />
        </Modal>
    );
}

ModalBatchAddTasksManager.propTypes = {
    batchAddTasksManager: PropTypes.object.isRequired,
    setBatchAddTasksManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalBatchAddTasksManager);