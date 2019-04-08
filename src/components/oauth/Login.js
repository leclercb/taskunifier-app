import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Icon from '../common/Icon';

function Login(props) {
    const [visible, setVisible] = useState(true);

    const onLogin = () => {
        setVisible(false);
    }

    return (
        <Modal
            title={<Icon icon="cogs" text="Login"/>}
            visible={visible}
            closable={false}
            onOk={onLogin}
            footer={
                <Button key="submit" type="primary" loading={false} onClick={onLogin}>
                    Login
                </Button>
            }>
            You need to login to Toodledo !
        </Modal>
    );
}

export default Login;