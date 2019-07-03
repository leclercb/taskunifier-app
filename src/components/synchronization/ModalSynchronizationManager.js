import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import SynchronizationManager from 'components/synchronization/SynchronizationManager';

function ModalSynchronizationManager(props) {
    const onCloseSynchronizationManager = () => {
        props.setSynchronizationManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="sync-alt" text="Synchronization Manager" />}
            visible={props.synchronizationManager.visible}
            width="50%"
            closable={false}
            footer={(
                <Button onClick={onCloseSynchronizationManager}>
                    Close
                </Button>
            )}>
            <SynchronizationManager />
        </Modal>
    );
}

ModalSynchronizationManager.propTypes = {
    synchronizationManager: PropTypes.object.isRequired,
    setSynchronizationManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalSynchronizationManager);