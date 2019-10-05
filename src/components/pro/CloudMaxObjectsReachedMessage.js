import React from 'react';
import { Button, Empty, message } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getConfig } from 'config/Config';
import { openExternalLink } from 'utils/ElectronUtils';

export function CloudMaxObjectsReachedMessage({ session, buyItem }) {
    const onClick = () => {
        openExternalLink(getConfig().cloudUrl);
    };

    const onBuyItem = async () => {
        message.info('Redirecting to Paypal...', 5);
        await buyItem(getConfig().cloudItemSku, session.user.id, session.user.email);
    };

    return (
        <Empty
            image={(<Icon color="#ffecb3" icon="lock" size={64} />)}
            description="You have reached the maximum number of objects !">
            <Button onClick={onClick} style={{ marginRight: 10 }}>Click here to get more information</Button>
            <Button type="primary" onClick={onBuyItem}>Subscribe to TaskUnifier Cloud Pro</Button>
        </Empty>
    );
}

CloudMaxObjectsReachedMessage.propTypes = {
    session: PropTypes.object.isRequired,
    buyItem: PropTypes.func.isRequired
};

export default CloudMaxObjectsReachedMessage;