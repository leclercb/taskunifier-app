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

function EventWrapper({ event, children }) {
    return (
        <div
            className="wrapper-start-date"
            style={{
                backgroundColor: getImportanceColor(event.task.importance, event.settings)
            }}>
            {children}
        </div>
    );
}

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

    const onEventResize = ({ event, start, end }) => {
        console.log(event, start, end);
    };

    const onEventDrop = ({ event, start, end, isAllDay }) => {
        console.log(event, start, end, isAllDay);
    };

    return (
        <div style={{
            height: 'calc(100% - 40px)',
            padding: 3
        }}>
            <DnDCalendar
                className="task-calendar"
                events={getEvents()}
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable={true}
                selectable={true}
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
    setSelectedTaskIds: PropTypes.func.isRequired
};

export default withSettings(withTasks(TaskCalendar, { applySelectedTaskFilter: true }));