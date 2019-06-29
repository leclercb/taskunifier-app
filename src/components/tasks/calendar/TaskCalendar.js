import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import CalendarEvent from 'components/tasks/calendar/CalendarEvent';
import CalendarEventWrapper from 'components/tasks/calendar/CalendarEventWrapper';
import withApp from 'containers/WithApp';
import withSettings from 'containers/WithSettings';
import withTasks from 'containers/WithTasks';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import 'components/tasks/calendar/TaskCalendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

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
                    mode: 'startDate',
                    selected: props.selectedTaskIds.includes(task.id)
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
                    mode: 'dueDate',
                    selected: props.selectedTaskIds.includes(task.id)
                });
            }
        });

        return events;
    };

    const onView = view => {
        props.setSelectedCalendarView(view);
    };

    const onSelectEvent = event => {
        props.setSelectedTaskIds([event.task.id]);
    };

    const onDoubleClickEvent = event => {
        props.setTaskEditionManagerOptions({
            visible: true,
            taskId: event.task.id
        });
    };

    const onSelectSlot = async ({ start, end, action }) => {
        if (action === 'select' && ['week', 'work_week', 'day'].includes(props.selectedCalendarView)) {
            const task = await props.addTask({
                title: 'Untitled',
                startDate: moment(start).toISOString(),
                dueDate: moment(end).toISOString(),
                length: moment(end).diff(moment(start), 'minutes')
            });

            props.setTaskEditionManagerOptions({
                visible: true,
                taskId: task.id
            });
        }
    };

    const onEventChange = ({ event, start, end }) => {
        if (event.mode === 'startDate') {
            props.updateTask({
                ...event.task,
                startDate: moment(start).toISOString(),
                length: moment(end).diff(moment(start), 'minutes')
            });
        } else {
            props.updateTask({
                ...event.task,
                dueDate: moment(end).toISOString(),
                length: moment(end).diff(moment(start), 'minutes')
            });
        }
    };

    return (
        <div style={{
            height: 'calc(100% - 40px)',
            padding: 3
        }}>
            <DnDCalendar
                className="task-calendar"
                view={props.selectedCalendarView}
                events={getEvents()}
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                onView={onView}
                onSelectEvent={onSelectEvent}
                onDoubleClickEvent={onDoubleClickEvent}
                onSelectSlot={onSelectSlot}
                onEventDrop={onEventChange}
                onEventResize={onEventChange}
                resizable={true}
                selectable={true}
                components={{
                    event: CalendarEvent,
                    eventWrapper: CalendarEventWrapper
                }} />
        </div>
    );
}

TaskCalendar.propTypes = {
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    addTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired,
    selectedCalendarView: PropTypes.oneOf(['month', 'week', 'work_week', 'day', 'agenda']).isRequired,
    calendarDateMode: PropTypes.oneOf(['both', 'startDate', 'dueDate']).isRequired,
    setSelectedCalendarView: PropTypes.func.isRequired,
    setTaskEditionManagerOptions: PropTypes.func.isRequired
};

export default withApp(withSettings(withTasks(TaskCalendar, { applySelectedTaskFilter: true })));