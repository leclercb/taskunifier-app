import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import CustomIndicator from 'components/common/CustomIndicator';
import LoadingIndicator from 'components/common/LoadingIndicator';
import { useSessionApi } from 'hooks/UseSessionApi';

function PrivateComponent({ userRole, children }) {
    const sessionApi = useSessionApi();

    const [loginError, setLoginError] = useState(null);

    useEffect(() => {
        const fn = async () => {
            if (!sessionApi.session.authenticated) {
                try {
                    await sessionApi.login();
                    setLoginError(null);
                } catch (error) {
                    setLoginError(error);
                }
            }
        };

        fn();
    }, [sessionApi.session.authenticated, sessionApi.login]);

    if (loginError) {
        return (
            <CustomIndicator content={(
                <Alert
                    type="error"
                    message={loginError.toString()} showIcon={true} />
            )} />
        );
    }

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