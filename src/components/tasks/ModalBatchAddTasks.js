import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from '../../containers/WithApp';
import BatchAddTasks from './BatchAddTasks';
import Icon from '../common/Icon';

function ModalBatchAddTasks(props) {
    const onClose = () => {
        props.setBatchAddTasksOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="magic" text="Batch Add Tasks" />}
            visible={props.batchAddTasks.visible}
            width="80%"
            closable={false}
            footer={
                <Button onClick={onClose}>
                    Close
                </Button>
            }>
            <BatchAddTasks onAdd={() => onClose()} />
        </Modal>
    );
}

ModalBatchAddTasks.propTypes = {
    batchAddTasks: PropTypes.object.isRequired,
    setBatchAddTasksOptions: PropTypes.func.isRequired
}

export default withApp(ModalBatchAddTasks);