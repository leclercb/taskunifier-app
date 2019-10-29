import React from 'react';
import { Button, Descriptions, Popover } from 'antd';
import Avatar from 'components/common/Avatar';
import LeftRight from 'components/common/LeftRight';
import { useAppApi } from 'hooks/UseAppApi';
import { useSessionApi } from 'hooks/UseSessionApi';

function UserMenu() {
    const appApi = useAppApi();
    const sessionApi = useSessionApi();

    const onShowAccount = async () => {
        appApi.setAccountManagerOptions({ visible: true });
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
                        {sessionApi.session.user.metaData.subscriptionInfo.type}
                    </Descriptions.Item>
                </Descriptions>
            ) : null}
            <LeftRight
                left={(
                    <Button type="primary" onClick={onShowAccount}>Account</Button>
                )}
                right={(
                    <Button type="dashed" onClick={sessionApi.logout}>Logout</Button>
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