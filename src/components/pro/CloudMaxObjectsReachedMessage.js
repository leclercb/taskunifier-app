import React from 'react';
import { Button, Empty } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';

export function CloudMaxObjectsReachedMessage({ setAccountManagerOptions }) {
    const onShowAccount = async () => {
        setAccountManagerOptions({ visible: true });
    };

    return (
        <Empty
            image={(<Icon color="#ffecb3" icon="lock" size={64} />)}
            description="You have reached the maximum number of objects !">
            <Button type="primary" onClick={onShowAccount}>Go to account to subscribe to TaskUnifier Cloud Pro</Button>
        </Empty>
    );
}

CloudMaxObjectsReachedMessage.propTypes = {
    setAccountManagerOptions: PropTypes.func.isRequired
};

export default CloudMaxObjectsReachedMessage;