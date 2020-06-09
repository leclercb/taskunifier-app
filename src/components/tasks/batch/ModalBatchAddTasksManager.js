import React, { useRef } from 'react';
import { Button, Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import BatchAddTasksManager from 'components/tasks/batch/BatchAddTasksManager';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';

function ModalBatchAddTasksManager({ apis }) {
    const { appApi } = apis;

    const [form] = Form.useForm();
    const managerRef = useRef();

    const onClose = () => {
        appApi.setBatchAddTasksManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="magic" text="Batch Add Tasks" />}
            visible={appApi.batchAddTasksManager.visible}
            width="80%"
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <React.Fragment>
                    <Button onClick={() => managerRef.current.addTasks()}>
                        <Icon icon="plus" text="Add tasks" />
                    </Button>
                    <Spacer />
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </React.Fragment>
            )}>
            <BatchAddTasksManager ref={managerRef} form={form} onSuccess={() => onClose()} />
        </Modal>
    );
}

ModalBatchAddTasksManager.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(ModalBatchAddTasksManager, () => ({
    appApi: useAppApi()
}));