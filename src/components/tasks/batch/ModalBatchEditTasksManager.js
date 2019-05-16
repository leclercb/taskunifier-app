import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import BatchEditTasksManager from 'components/tasks/batch/BatchEditTasksManager';
import Icon from 'components/common/Icon';

function ModalBatchEditTasksManager(props) {
    const onClose = () => {
        props.setBatchEditTasksManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="magic" text="Batch Edit Tasks" />}
            visible={props.batchEditTasksManager.visible}
            width="80%"
            closable={false}
            footer={(
                <Button onClick={onClose}>
                    Close
                </Button>
            )}>
            <BatchEditTasksManager onEdit={() => onClose()} />
        </Modal>
    );
}

ModalBatchEditTasksManager.propTypes = {
    batchEditTasksManager: PropTypes.object.isRequired,
    setBatchEditTasksManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalBatchEditTasksManager);