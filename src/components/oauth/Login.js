import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Icon from '../common/Icon';

function Login(props) {
    const [visible, setVisible] = useState(true);

    const onOk = () => {
        setVisible(false);
    }

    return (
        <Modal
            title={<span><Icon icon="user" /><span>Login</span></span>}
            visible={visible}
            closable={false}
            onOk={onOk}
            footer={
                <Button key="submit" type="primary" loading={false} onClick={onOk}>
                    Login
                </Button>
            }>
            You need to login to Toodledo !
        </Modal>
    );
}

export default Login;