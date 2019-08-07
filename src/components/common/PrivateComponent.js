import React, { useEffect } from 'react';
import { Alert, Button, Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import Logo from 'components/common/Logo';
import withSession from 'containers/WithSession';

function PrivateComponent({ session, login, logout, userRole, children }) {
    useEffect(() => {
        const fn = async () => {
            if (!session.authenticated) {
                await login();
            }
        };

        fn();
    }, [session.authenticated, login]);

    if (!session.authenticated) {
        return (
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                <Logo size={120} />
                <br />
                <br />
                <br />
                <Spin size="large" />
            </div>
        );
    }

    if (userRole && (!Array.isArray(session.user.groups) || !session.user.groups.includes(userRole))) {
        return (
            <Modal
                visible={true}
                closable={false}
                footer={(
                    <Button onClick={logout}>
                        Logout
                    </Button>
                )}>
                <Alert
                    message="Access denied"
                    description={`You don't have the required role "${userRole}"`}
                    type="error"
                    showIcon
                />
            </Modal>
        );
    }

    return children;
}

PrivateComponent.propTypes = {
    userRole: PropTypes.string,
    session: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default withSession(PrivateComponent);