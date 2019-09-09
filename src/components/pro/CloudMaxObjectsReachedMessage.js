import React from 'react';
import { Button, Empty, message } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getConfig } from 'config/Config';
import withSession from 'containers/WithSession';

export function CloudMaxObjectsReachedMessage({ session, buyItem }) {
    const onBuyItem = async () => {
        message.info('Redirecting to Paypal...', 5);
        await buyItem(getConfig().cloudItemSku, session.user.id, session.user.email);
    };

    return (
        <Empty
            image={(<Icon color="#ffecb3" icon="lock" size={64} />)}
            description="You have reached the maximum number of objects !">
            <Button type="dashed" onClick={onBuyItem}>Start your &quot;pro&quot; subscription</Button>
        </Empty>
    );
}

CloudMaxObjectsReachedMessage.propTypes = {
    session: PropTypes.object.isRequired,
    buyItem: PropTypes.func.isRequired
};

export default withSession(CloudMaxObjectsReachedMessage);