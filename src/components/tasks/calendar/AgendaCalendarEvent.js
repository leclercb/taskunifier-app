import React from 'react';
import PropTypes from 'prop-types';
import CalendarEventWrapper from 'components/tasks/calendar/CalendarEventWrapper';
import TaskTitle from 'components/tasks/common/TaskTitle';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';
import { useTaskApi } from 'hooks/UseTaskApi';

function AgendaCalendarEvent({ apis, event }) {
    const { appApi, taskApi } = apis;

    const onSelectEvent = event => {
        taskApi.setSelectedTaskIds(event.task.id);
    };

    const onDoubleClickEvent = event => {
        appApi.setTaskEditionManagerOptions({
            visible: true,
            taskId: event.task.id
        });
    };

    return (
        <CalendarEventWrapper event={event}>
            <div
                className="rbc-event"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectEvent(event)}
                onDoubleClick={() => onDoubleClickEvent(event)}>
                <TaskTitle taskId={event.task.id} />
            </div>
        </CalendarEventWrapper>
    );
}

AgendaCalendarEvent.propTypes = {
    apis: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired
};

export default withBusyCheck(AgendaCalendarEvent, () => ({
    appApi: useAppApi(),
    taskApi: useTaskApi()
}));