import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import ReminderChecker from 'components/reminders/ReminderChecker';
import ReminderManager from 'components/reminders/ReminderManager';
import { useInterval } from 'hooks/UseInterval';

function ModalReminderManager(props) {
    const [date, setDate] = useState(moment().toISOString());

    useInterval(() => {
        setDate(moment().toISOString());
    }, 30000);

    const onShowReminderManager = () => {
        props.setReminderManagerOptions({ visible: true });
    };

    const onCloseReminderManager = () => {
        props.setReminderManagerOptions({ visible: false });
    };

    return (
        <React.Fragment>
            <ReminderChecker show={onShowReminderManager} date={date} />
            <Modal
                title={<Icon icon="bell" text="Reminder Manager" />}
                visible={props.reminderManager.visible}
                width="60%"
                closable={false}
                onOk={onCloseReminderManager}
                onCancel={onCloseReminderManager}
                footer={(
                    <Button onClick={onCloseReminderManager}>
                        Close
                    </Button>
                )}>
                <ReminderManager date={date} />
            </Modal>
        </React.Fragment>
    );
}

ModalReminderManager.propTypes = {
    reminderManager: PropTypes.object.isRequired,
    setReminderManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalReminderManager);