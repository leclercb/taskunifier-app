import React, { useEffect } from 'react';
import { Alert, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import LoadingIndicator from 'components/common/LoadingIndicator';
import { useSession } from 'hooks/UseSession';

function PrivateComponent({ userRole, children }) {
    const sessionApi = useSession();

    useEffect(() => {
        const fn = async () => {
            if (!sessionApi.session.authenticated) {
                await sessionApi.login();
            }
        };

        fn();
    }, [sessionApi.session.authenticated, sessionApi.login]);

    if (!sessionApi.session.authenticated) {
        return (<LoadingIndicator />);
    }

    if (userRole && (!Array.isArray(sessionApi.session.user.groups) || !sessionApi.session.user.groups.includes(userRole))) {
        return (
            <Modal
                visible={true}
                closable={false}
                footer={(
                    <Button onClick={sessionApi.logout}>
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
    userRole: PropTypes.string
};

export default PrivateComponent;