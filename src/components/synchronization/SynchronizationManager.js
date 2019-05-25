import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import withSettings from 'containers/WithSettings';
import withSynchronization from 'containers/WithSynchronization';

function SynchronizationManager(props) {
    const [code, setCode] = useState('');

    const onAuthorize = () => {
        props.authorize();
    };

    const onGetToken = () => {

    };

    const onCodeChange = event => {
        setCode(event.target.value);
    };

    if (!props.settings.refreshToken) {
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

    return (
        'You are logged in'
    );
}

SynchronizationManager.propTypes = {
    settings: SettingsPropType.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(withSynchronization(SynchronizationManager));