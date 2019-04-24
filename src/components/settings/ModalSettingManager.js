import React from 'react';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import SettingManager from 'components/settings/SettingManager';

function ModalSettingManager(props) {
    const onOk = () => {
        props.setSettingManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="cog" text="Settings" />}
            visible={props.settingManager.visible}
            width="80%"
            closable={false}
            onOk={onOk}
            footer={
                <Button onClick={onOk}>
                    Close
                </Button>
            }>
            <SettingManager />
        </Modal>
    );
}

export default withApp(ModalSettingManager);