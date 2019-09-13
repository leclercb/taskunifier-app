import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import moment from 'moment';
import Icon from 'components/common/Icon';
import ReminderChecker from 'components/reminders/ReminderChecker';
import ReminderManager from 'components/reminders/ReminderManager';
import { useAppApi } from 'hooks/UseAppApi';
import { useInterval } from 'hooks/UseInterval';

function ModalReminderManager() {
    const appApi = useAppApi();

    const [date, setDate] = useState(moment().toISOString());

    useInterval(() => {
        setDate(moment().toISOString());
    }, 30000);

    const onShowReminderManager = () => {
        appApi.setReminderManagerOptions({ visible: true });
    };

    const onCloseReminderManager = () => {
        appApi.setReminderManagerOptions({ visible: false });
    };

    return (
        <React.Fragment>
            <ReminderChecker show={onShowReminderManager} date={date} />
            <Modal
                title={<Icon icon="bell" text="Reminder Manager" />}
                visible={appApi.reminderManager.visible}
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

export default ModalReminderManager;