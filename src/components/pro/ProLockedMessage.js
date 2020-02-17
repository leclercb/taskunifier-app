import React from 'react';
import { Button, Empty } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getConfig } from 'config/Config';
import { openExternalLink } from 'utils/ElectronUtils';

export function ProLockedMessage({ setAccountManagerOptions, info }) {
    if (process.env.REACT_APP_MODE === 'electron') {
        const onClick = () => {
            openExternalLink(getConfig().appUrl);
        };

        let description = 'This feature requires a TaskUnifier App Pro license !';

        if (info) {
            description = 'TaskUnifier Pro has not been activated !';
        }

        return (
            <Empty
                image={(<Icon color="#ffecb3" icon="lock" size={64} />)}
                description={description}>
                <Button onClick={onClick}>Click here to get more information</Button>
            </Empty>
        );
    } else {
        const onShowAccount = async () => {
            setAccountManagerOptions({ visible: true });
        };

        let description = 'This feature requires a TaskUnifier Cloud Pro subscription !';

        if (info) {
            description = 'TaskUnifier Pro has not been activated !';
        }

        return (
            <Empty
                image={(<Icon color="#ffecb3" icon="lock" size={64} />)}
                description={description}>
                <Button type="primary" onClick={onShowAccount}>Go to account to subscribe to TaskUnifier Cloud Pro</Button>
            </Empty>
        );
    }
}

ProLockedMessage.propTypes = {
    setAccountManagerOptions: PropTypes.func,
    info: PropTypes.bool
};

export default ProLockedMessage;