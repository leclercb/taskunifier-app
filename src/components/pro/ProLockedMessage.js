import React from 'react';
import { Button, Empty } from 'antd';
import Icon from 'components/common/Icon';
import Constants from 'constants/Constants';

const { ipcRenderer } = window.require('electron');

export function ProLockedMessage() {
    const onClick = () => {
        ipcRenderer.send('open-external', Constants.purchaseUrl);
    }

    return (
        <Empty
            image={(<Icon color="ffecb3" icon="lock" size={64} />)}
            description="TaskUnifier Pro has not been activated !">
            <Button onClick={onClick}>Click here to get more information</Button>
        </Empty>
    );
}

export default ProLockedMessage;