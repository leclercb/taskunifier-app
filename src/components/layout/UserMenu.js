import React from 'react';
import { Popover, Button } from 'antd';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import withSession from 'containers/WithSession';

function UserMenu({ session, logout }) {
    const content = (
        <Button onClick={logout}>Logout</Button>
    );

    return (
        <Popover
            placement="bottomRight"
            title={session.user ? session.user.attributes.email : "Unknown user"}
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
}

export default withSession(UserMenu);