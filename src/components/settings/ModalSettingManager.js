import React from 'react';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import SettingManager from 'components/settings/SettingManager';
import { useAppApi } from 'hooks/UseAppApi';

function ModalSettingManager() {
    const appApi = useAppApi();

    const onClose = () => {
        appApi.setSettingManagerOptions({ visible: false });
    };

    const shortHash = (process.env.REACT_APP_GIT_COMMIT_HASH || '').substring(0, 7);

    return (
        <Modal
            title={<Icon icon="cog" text="Settings" />}
            visible={appApi.settingManager.visible}
            width="80%"
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <LeftRight right={(
                    <Button onClick={onClose}>
                        Close
                    </Button>
                )}>
                    <div style={{ textAlign: 'left', fontSize: 10 }}>
                        Version: <strong>{process.env.REACT_APP_VERSION}</strong> ({shortHash})
                    </div>
                </LeftRight>
            )}>
            <SettingManager
                category={appApi.settingManager.category}
                onCategorySelection={category => appApi.setSettingManagerOptions({ category })} />
        </Modal>
    );
}

export default ModalSettingManager;