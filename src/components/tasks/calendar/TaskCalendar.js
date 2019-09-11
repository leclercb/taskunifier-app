import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import CalendarEvent from 'components/tasks/calendar/CalendarEvent';
import CalendarEventWrapper from 'components/tasks/calendar/CalendarEventWrapper';
import withApp from 'containers/WithApp';
import withSettings from 'containers/WithSettings';
import { useTasks } from 'hooks/UseTasks';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import 'components/tasks/calendar/TaskCalendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function TaskCalendar(props) {
    const taskApi = useTasks();

    const getEvents = () => {
        const events = [];

        taskApi.tasks.forEach(task => {
            const matchStartDate = task.startDate && (taskApi.calendarDateMode === 'both' || taskApi.calendarDateMode === 'startDate');
            const matchDueDate = task.dueDate && (taskApi.calendarDateMode === 'both' || taskApi.calendarDateMode === 'dueDate');

            if (matchStartDate) {
                events.push({
                    id: `${task.id}_startDate`,
                    title: task.title,
                    start: moment(task.startDate).toDate(),
                    end: moment(task.startDate).add(task.length, 'seconds').toDate(),
                    task,
                    settings: props.settings,
                    mode: 'startDate',
                    selected: taskApi.selectedTaskIds.includes(task.id)
                });
            }

            if (matchDueDate) {
                events.push({
                    id: `${task.id}_dueDate`,
                    title: task.title,
                    start: moment(task.dueDate).subtract(task.length, 'seconds').toDate(),
                    end: moment(task.dueDate).toDate(),
                    task,
                    settings: props.settings,
                    mode: 'dueDate',
                    selected: taskApi.selectedTaskIds.includes(task.id)
                });
            }
        });

        return events;
    };

    const onView = view => {
        taskApi.setSelectedCalendarView(view);
    };

    const onSelectEvent = event => {
        taskApi.setSelectedTaskIds([event.task.id]);
    };

    const onDoubleClickEvent = event => {
        props.setTaskEditionManagerOptions({
            visible: true,
            taskId: event.task.id
        });
    };

    const onSelectSlot = async ({ start, end, action }) => {
        if (action === 'select' && ['week', 'work_week', 'day'].includes(taskApi.selectedCalendarView)) {
            const task = await taskApi.addTask({
                startDate: moment(start).toISOString(),
                dueDate: moment(end).toISOString(),
                length: moment(end).diff(moment(start), 'seconds')
            });

            props.setTaskEditionManagerOptions({
                visible: true,
                taskId: task.id
            });
        }
    };

    const onEventChange = ({ event, start, end }) => {
        if (event.mode === 'startDate') {
            taskApi.updateTask({
                ...event.task,
                startDate: moment(start).toISOString(),
                length: moment(end).diff(moment(start), 'seconds')
            });
        } else {
            taskApi.updateTask({
                ...event.task,
                dueDate: moment(end).toISOString(),
                length: moment(end).diff(moment(start), 'seconds')
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
                view={taskApi.selectedCalendarView}
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
    settings: SettingsPropType.isRequired,
    setTaskEditionManagerOptions: PropTypes.func.isRequired
};

export default withApp(withSettings(TaskCalendar));