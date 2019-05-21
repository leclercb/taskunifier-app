import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import ReminderManager from 'components/reminders/ReminderManager';

function ModalReminderManager(props) {
    const onCloseReminderManager = () => {
        props.setReminderManagerOptions({ visible: false });
    };

    return (
        <Modal
            title={<Icon icon="bell" text="Reminder Manager" />}
            visible={props.reminderManager.visible}
            width="60%"
            closable={false}
            footer={(
                <Button onClick={onCloseReminderManager}>
                    Close
                </Button>
            )}>
            <ReminderManager />
        </Modal>
    );
}

ModalReminderManager.propTypes = {
    reminderManager: PropTypes.object.isRequired,
    setReminderManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalReminderManager);