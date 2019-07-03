import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import Spacer from 'components/common/Spacer';
import withSettings from 'containers/WithSettings';
import withSynchronization from 'containers/WithSynchronization';
import { SettingsPropType } from 'proptypes/SettingPropTypes';

function SynchronizationManager(props) {
    const [code, setCode] = useState('');

    const onAuthorize = async () => {
        await props.authorize();
    };

    const onGetToken = async () => {
        await props.getToken(code);
    };

    const onShowAccountInfo = async () => {
        await props.getAccountInfo();
    };

    const onSynchronize = async () => {
        await props.synchronize();
    };

    const onCodeChange = event => {
        setCode(event.target.value);
    };

    if (!props.settings.toodledo || !props.settings.toodledo.refreshToken) {
        return (
            <React.Fragment>
                {!code && (
                    <Button onClick={onAuthorize}>
                        Click here to login to Toodledo
                    </Button>
                )}
                <div>
                    <Form.Item label="Connection code">
                        <Input value={code} onChange={onCodeChange} />
                    </Form.Item>
                    {code && (
                        <Button onClick={onGetToken}>
                            Click here to connect
                        </Button>
                    )}
                </div>
            </React.Fragment>
        );
    }

    if (props.toodledo.accountInfo) {
        return (
            <React.Fragment>
                Your account information:
                <div>
                    {JSON.stringify(props.toodledo)}
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Button onClick={onShowAccountInfo}>
                Show account info
            </Button>
            <Spacer />
            <Button onClick={onSynchronize}>
                Synchronize
            </Button>
        </React.Fragment>
    );
}

SynchronizationManager.propTypes = {
    toodledo: PropTypes.object.isRequired,
    settings: SettingsPropType.isRequired,
    updateSettings: PropTypes.func.isRequired,
    authorize: PropTypes.func.isRequired,
    getToken: PropTypes.func.isRequired,
    getAccountInfo: PropTypes.func.isRequired,
    synchronize: PropTypes.func.isRequired
};

export default withSettings(withSynchronization(SynchronizationManager));