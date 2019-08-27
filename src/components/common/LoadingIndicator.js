import React from 'react';
import { Spin } from 'antd';
import Logo from 'components/common/Logo';

function LoadingIndicator() {
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

export default LoadingIndicator;