import React from 'react';
import { Button, Modal } from 'antd';
import withSettings from '../../containers/WithSettings';
import Icon from '../common/Icon';
import Settings from '../settings/Settings';

function ModalSettings(props) {
    const onOk = () => {
        props.setSettingsVisible(false);
    }

    return (
        <Modal
            title={<Icon icon="cog" text="Settings" />}
            visible={props.settings.visible}
            width="80%"
            closable={false}
            onOk={onOk}
            footer={
                <Button key="submit" onClick={onOk}>
                    Close
                </Button>
            }>
            <Settings />
        </Modal>
    );
}

export default withSettings(ModalSettings);