import React from 'react';
import { Button, Modal } from 'antd';
import AccountManager from 'components/account/AccountManager';
import Icon from 'components/common/Icon';
import { useAppApi } from 'hooks/UseAppApi';

function ModalAccountManager() {
    const appApi = useAppApi();

    const onClose = () => {
        appApi.setAccountManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="cog" text="Account" />}
            visible={appApi.accountManager.visible}
            width="80%"
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <Button onClick={onClose}>
                    Close
                </Button>
            )}>
            <AccountManager />
        </Modal>
    );
}

export default ModalAccountManager;