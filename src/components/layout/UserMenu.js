import React from 'react';
import { Button, Descriptions, Popover, message } from 'antd';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import LeftRight from 'components/common/LeftRight';
import { getConfig } from 'config/Config';
import withSession from 'containers/WithSession';

function UserMenu({ session, logout, buyItem }) {
    const onBuyItem = async () => {
        message.info('Redirecting to Paypal...', 5);
        await buyItem(getConfig().cloudItemSku, session.user.id, session.user.email);
    };

    const content = (
        <React.Fragment>
            {session.user ? (
                <Descriptions title="User Info" column={1} size="small" bordered={true} style={{ marginBottom: 20 }}>
                    <Descriptions.Item label="Email">{session.user.email}</Descriptions.Item>
                    <Descriptions.Item label="Subscription Type">{session.user.metaData.computedSubscriptionType}</Descriptions.Item>
                    <Descriptions.Item label="Subscription Expiration">{session.user.metaData.subscriptionExpiration}</Descriptions.Item>
                </Descriptions>
            ) : null}
            <LeftRight
                left={(
                    <Button type="dashed" onClick={onBuyItem}>Extend your &quot;pro&quot; subscription</Button>
                )}
                right={(
                    <Button type="primary" onClick={logout}>Logout</Button>
                )} />
        </React.Fragment>
    );

    return (
        <Popover
            placement="bottomRight"
            content={content}
            overlayStyle={{
                width: 500
            }}>
            <span>
                <Avatar size={40} />
            </span>
        </Popover>
    );
}

UserMenu.propTypes = {
    session: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    buyItem: PropTypes.func.isRequired
};

export default withSession(UserMenu);