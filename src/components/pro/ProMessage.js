import React from 'react';
import { Button, Empty } from 'antd';
import Icon from 'components/common/Icon';
import Constants from 'constants/Constants';

const { ipcRenderer } = window.require('electron');

export function ProMessage() {
    const onClick = () => {
        ipcRenderer.send('open-external', Constants.purchaseUrl);
    }

    return (
        <Empty
            image={(<Icon color="ffecb3" icon="lock" size={64} />)}
            description="This feature is available in TaskUnifier Pro only !">
            <Button onClick={onClick}>Click here to get more information</Button>
        </Empty>
    );
}

export default ProMessage;