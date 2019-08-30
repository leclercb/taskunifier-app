import React from 'react';
import { Button, Descriptions, Popover } from 'antd';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import withSession from 'containers/WithSession';

function UserMenu({ session, logout }) {
    const content = (
        <React.Fragment>
            {session.user ? (
                <Descriptions title="User Info" column={1} size="small" bordered={true}>
                    <Descriptions.Item label="Email">{session.user.email}</Descriptions.Item>
                    <Descriptions.Item label="Subscription Type">{session.user.metaData.computedSubscriptionType}</Descriptions.Item>
                    <Descriptions.Item label="Subscription Expiration">{session.user.metaData.subscriptionExpiration}</Descriptions.Item>
                </Descriptions>
            ) : null}
            <div style={{ marginTop: 20 }}>
                <Button type="primary" onClick={logout}>Logout</Button>
            </div>
        </React.Fragment>
    );

    return (
        <Popover
            placement="bottomRight"
            content={content}
            overlayStyle={{
                width: 400
            }}>
            <span>
                <Avatar size={40} />
            </span>
        </Popover>
    );
}

UserMenu.propTypes = {
    session: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
};

export default withSession(UserMenu);