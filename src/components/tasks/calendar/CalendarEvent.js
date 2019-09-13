import React from 'react';
import PropTypes from 'prop-types';
import { TaskTitle } from 'components/tasks/common/TaskTitle';

function CalendarEvent({ event }) {
    return (
        <TaskTitle
            taskId={event.task.id}
            settings={event.settings} />
    );
}

CalendarEvent.propTypes = {
    event: PropTypes.object.isRequired
};

export default CalendarEvent;