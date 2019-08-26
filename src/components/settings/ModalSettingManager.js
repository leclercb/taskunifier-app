import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import SettingManager from 'components/settings/SettingManager';

function ModalSettingManager(props) {
    const onClose = () => {
        props.setSettingManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="cog" text="Settings" />}
            visible={props.settingManager.visible}
            width="80%"
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <Button onClick={onClose}>
                    Close
                </Button>
            )}>
            <SettingManager />
        </Modal>
    );
}

ModalSettingManager.propTypes = {
    settingManager: PropTypes.object.isRequired,
    setSettingManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalSettingManager);