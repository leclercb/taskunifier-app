import React from 'react';
import { Button, Empty } from 'antd';
import Icon from 'components/common/Icon';
import { getConfig } from 'config/Config';
import { openExternalLink } from 'utils/ElectronUtils';

export function ProLockedMessage() {
    const onClick = () => {
        openExternalLink(getConfig().purchaseUrl);
    };

    return (
        <Empty
            image={(<Icon color="ffecb3" icon="lock" size={64} />)}
            description="TaskUnifier Pro has not been activated !">
            <Button onClick={onClick}>Click here to get more information</Button>
        </Empty>
    );
}

export default ProLockedMessage;