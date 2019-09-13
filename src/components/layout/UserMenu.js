import React from 'react';
import { Button, Descriptions, Popover, message } from 'antd';
import Avatar from 'components/common/Avatar';
import LeftRight from 'components/common/LeftRight';
import { getConfig } from 'config/Config';
import { useSessionApi } from 'hooks/UseSessionApi';

function UserMenu() {
    const sessionApi = useSessionApi();

    const onBuyItem = async () => {
        message.info('Redirecting to Paypal...', 5);
        await sessionApi.buyItem(getConfig().cloudItemSku, sessionApi.session.user.id, sessionApi.session.user.email);
    };

    const content = (
        <React.Fragment>
            <div style={{ width: '100%', textAlign: 'right', fontSize: 10 }}>
                Version: <strong>{process.env.REACT_APP_VERSION}</strong>
            </div>
            {sessionApi.session.user ? (
                <Descriptions
                    title="User Info"
                    column={1}
                    size="small"
                    bordered={true}
                    style={{ marginBottom: 20 }}>
                    <Descriptions.Item label="Email">
                        {sessionApi.session.user.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Subscription Type">
                        {sessionApi.session.user.metaData.computedSubscriptionType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Subscription Expiration">
                        {sessionApi.session.user.metaData.subscriptionExpiration}
                    </Descriptions.Item>
                </Descriptions>
            ) : null}
            <LeftRight
                left={(
                    <Button type="dashed" onClick={onBuyItem}>Extend your &quot;pro&quot; subscription</Button>
                )}
                right={(
                    <Button type="primary" onClick={sessionApi.logout}>Logout</Button>
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

export default UserMenu;