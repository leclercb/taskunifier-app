import React from 'react';
import { Spin } from 'antd';
import CustomIndicator from 'components/common/CustomIndicator';

function LoadingIndicator() {
    return (<CustomIndicator content={(<Spin size="large" />)} />);
}

export default LoadingIndicator;