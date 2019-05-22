import React from 'react';
import PropTypes from 'prop-types';
import ReminderList from 'components/reminders/ReminderList';

function ReminderManager(props) {
    return (
        <ReminderList date={props.date} />
    );
}

ReminderManager.propTypes = {
    date: PropTypes.string.isRequired
};

export default ReminderManager;