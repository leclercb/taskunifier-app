import React from 'react';
import { Button, Modal, Progress, Typography } from 'antd';
import Icon from 'components/common/Icon';
import { useAutoUpdaterApi } from 'hooks/UseAutoUpdaterApi';

function AutoUpdater() {
    const autoUpdaterApi = useAutoUpdaterApi();

    if (!autoUpdaterApi.updateInfo) {
        return null;
    }

    const onClose = () => {
        autoUpdaterApi.setVisible(false);
    };

    return (
        <Modal
            title={<Icon icon="code-branch" text="Auto Updater" />}
            visible={autoUpdaterApi.visible}
            width="80%"
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <React.Fragment>
                    {autoUpdaterApi.updateInfo && !autoUpdaterApi.downloadProgress && !autoUpdaterApi.updateDownloaded && (
                        <Button
                            type="primary"
                            onClick={() => autoUpdaterApi.downloadUpdate()}
                            style={{ marginRight: 10 }}>
                            Download update
                        </Button>
                    )}
                    {autoUpdaterApi.updateInfo && autoUpdaterApi.downloadProgress && (
                        <React.Fragment>
                            Downloading:&nbsp;&nbsp;
                            <Progress
                                percent={Math.round(autoUpdaterApi.downloadProgress.percent)}
                                style={{ marginRight: 10, width: 100 }} />
                        </React.Fragment>
                    )}
                    {autoUpdaterApi.updateInfo && autoUpdaterApi.updateDownloaded && (
                        <Button
                            type="primary"
                            onClick={() => autoUpdaterApi.quitAndInstall()}
                            style={{ marginRight: 10 }}>
                            Quit and Install
                        </Button>
                    )}
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </React.Fragment>
            )}>
            <Typography.Title>{autoUpdaterApi.updateInfo.version}</Typography.Title>
            <div dangerouslySetInnerHTML={{ __html: autoUpdaterApi.updateInfo.releaseNotes.replace(/<a /g, '<a target="github" ') }} />
        </Modal>
    );
}

export default AutoUpdater;