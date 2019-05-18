import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import { TaskTitle } from 'components/tasks/common/TaskTitle';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import 'components/tasks/calendar/TaskCalendar.css';
import { getImportanceColor } from 'utils/SettingUtils';

const localizer = BigCalendar.momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

function Event({ event }) {
    return (
        <TaskTitle
            task={event.task}
            settings={event.settings} />
    );
}

Event.propTypes = {
    event: PropTypes.object.isRequired
};

function EventWrapper({ event, children }) {
    let className;

    if (event.mode === 'startDate') {
        className = 'wrapper-start-date';
    } else {
        className = 'wrapper-due-date';
    }

    return (
        <div
            className={className}
            style={{
                backgroundColor: getImportanceColor(event.task.importance, event.settings)
            }}>
            {children}
        </div>
    );
}

EventWrapper.propTypes = {
    event: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired
};

function TaskCalendar(props) {
    const getEvents = () => {
        const events = [];

        props.tasks.forEach(task => {
            const matchStartDate = task.startDate && (props.calendarDateMode === 'both' || props.calendarDateMode === 'startDate');
            const matchDueDate = task.dueDate && (props.calendarDateMode === 'both' || props.calendarDateMode === 'dueDate');

            if (matchStartDate) {
                events.push({
                    id: `${task.id}_startDate`,
                    title: task.title,
                    start: moment(task.startDate).toDate(),
                    end: moment(task.startDate).add(task.length, 'minutes').toDate(),
                    task,
                    settings: props.settings,
                    mode: 'startDate'
                });
            }

            if (matchDueDate) {
                events.push({
                    id: `${task.id}_dueDate`,
                    title: task.title,
                    start: moment(task.dueDate).subtract(task.length, 'minutes').toDate(),
                    end: moment(task.dueDate).toDate(),
                    task,
                    settings: props.settings,
                    mode: 'dueDate'
                });
            }
        });

        return events;
    };

    const onSelectEvent = event => {
        props.setSelectedTaskIds([event.task.id]);
    };

    const onEventChange = ({ event, start, end }) => {
        if (event.mode === 'startDate') {
            props.updateTask({
                ...event.task,
                startDate: moment(start).toJSON(),
                length: moment(end).diff(moment(start), 'minutes')
            });
        } else {
            props.updateTask({
                ...event.task,
                dueDate: moment(end).toJSON(),
                length: moment(end).diff(moment(start), 'minutes')
            });
        }
    };

    const events = getEvents();
    const selectedEvent = props.selectedTaskIds.length === 1 ? events.find(event => event.task.id === props.selectedTaskIds[0]) : null;

    return (
        <div style={{
            height: 'calc(100% - 40px)',
            padding: 3
        }}>
            <DnDCalendar
                className="task-calendar"
                events={events}
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                onSelectEvent={onSelectEvent}
                onEventDrop={onEventChange}
                onEventResize={onEventChange}
                resizable={true}
                selectable={true}
                selected={selectedEvent}
                components={{
                    event: Event,
                    eventWrapper: EventWrapper
                }} />
        </div>
    );
}

TaskCalendar.propTypes = {
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    updateTask: PropTypes.func.isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired,
    calendarDateMode: PropTypes.oneOf(['both', 'startDate', 'dueDate']).isRequired
};

export default withSettings(withTasks(TaskCalendar, { applySelectedTaskFilter: true }));