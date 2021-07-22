import React from 'react';
import { Button, Modal } from 'antd';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import AgendaCalendarEvent from 'components/tasks/calendar/AgendaCalendarEvent';
import CalendarEvent from 'components/tasks/calendar/CalendarEvent';
import CalendarEventWrapper from 'components/tasks/calendar/CalendarEventWrapper';
import WeekListView from 'components/tasks/calendar/WeekListView';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useTaskTemplateApi } from 'hooks/UseTaskTemplateApi';
import { applyTaskTemplate } from 'utils/TemplateUtils';
import 'components/tasks/calendar/TaskCalendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function TaskCalendar({ apis }) {
    const { appApi, settingsApi, taskApi, taskFieldApi, taskTemplateApi } = apis;

    const getEvents = () => {
        const events = [];

        taskApi.filteredTasks.forEach(task => {
            const matchStartDate = task.startDate && taskApi.calendarEventTypes.includes('startDate');
            const matchDueDate = task.dueDate && taskApi.calendarEventTypes.includes('dueDate');
            const matchWorkLog = task.workLogs && taskApi.calendarEventTypes.includes('workLog');

            if (matchStartDate) {
                events.push({
                    id: `${task.id}_startDate`,
                    title: task.title,
                    start: moment(task.startDate).toDate(),
                    end: moment(task.startDate).add(task.length, 'second').toDate(),
                    allDay: !settingsApi.settings.showStartTime,
                    task,
                    settings: settingsApi.settings,
                    type: 'startDate',
                    selected: taskApi.selectedTaskIds.includes(task.id)
                });
            }

            if (matchDueDate) {
                events.push({
                    id: `${task.id}_dueDate`,
                    title: task.title,
                    start: moment(task.dueDate).subtract(task.length, 'second').toDate(),
                    end: moment(task.dueDate).toDate(),
                    allDay: !settingsApi.settings.showDueTime,
                    task,
                    settings: settingsApi.settings,
                    type: 'dueDate',
                    selected: taskApi.selectedTaskIds.includes(task.id)
                });
            }

            if (matchWorkLog) {
                task.workLogs.forEach(workLog => {
                    if (workLog.start && workLog.end) {
                        events.push({
                            id: `${task.id}_workLog_${workLog.id}`,
                            title: task.title,
                            start: moment(workLog.start).toDate(),
                            end: moment(workLog.end).toDate(),
                            allDay: false,
                            task,
                            workLogId: workLog.id,
                            settings: settingsApi.settings,
                            type: 'workLog',
                            selected: taskApi.selectedTaskIds.includes(task.id)
                        });
                    }
                });
            }
        });

        return events;
    };

    const onView = view => {
        taskApi.setSelectedCalendarView(view);
    };

    const onSelectEvent = event => {
        taskApi.setSelectedTaskIds(event.task.id);
    };

    const onDoubleClickEvent = event => {
        appApi.setTaskEditionManagerOptions({
            visible: true,
            taskId: event.task.id
        });
    };

    const onSelectSlot = ({ start, end, action }) => {
        if (action === 'select' && ['week', 'work_week', 'day'].includes(taskApi.selectedCalendarView)) {
            const modal = Modal.info({
                title: 'What do you want to do ?',
                width: 600,
                okText: 'Close',
                content: (
                    <React.Fragment>
                        <Button
                            onClick={async () => {
                                let task = {};

                                applyTaskTemplate(taskTemplateApi.defaultTaskTemplate, task, taskFieldApi.taskFields);

                                task.startDate = moment(start).toISOString();
                                task.dueDate = moment(end).toISOString();
                                task.length = moment(end).diff(moment(start), 'second');

                                task = await taskApi.addTask(task);

                                appApi.setTaskEditionManagerOptions({
                                    visible: true,
                                    taskId: task.id
                                });

                                modal.destroy();
                            }}>
                            <Icon icon="plus" text="Create a new task" />
                        </Button>
                        <Spacer />
                        <Button
                            disabled={taskApi.selectedTaskIds.length !== 1}
                            onClick={async () => {
                                if (taskApi.selectedTasks.length === 1) {
                                    await taskApi.updateTask({
                                        ...taskApi.selectedTasks[0],
                                        workLogs: [
                                            ...(taskApi.selectedTasks[0].workLogs || []),
                                            {
                                                id: uuid(),
                                                start: moment(start).toISOString(),
                                                end: moment(end).toISOString()
                                            }
                                        ]
                                    });

                                    if (!taskApi.calendarEventTypes.includes('workLog')) {
                                        await settingsApi.updateSettings({
                                            calendarEventTypes: [
                                                ...taskApi.calendarEventTypes,
                                                'workLog'
                                            ]
                                        });
                                    }
                                }

                                modal.destroy();
                            }}>
                            <Icon icon="plus" text="Create a work log for the selected task" />
                        </Button>
                    </React.Fragment>
                )
            });
        }
    };

    const onEventChange = ({ event, start, end }) => {
        switch (event.type) {
            case 'startDate': {
                taskApi.updateTask({
                    ...event.task,
                    startDate: moment(start).toISOString(),
                    length: moment(end).diff(moment(start), 'second')
                });
                break;
            }
            case 'dueDate': {
                taskApi.updateTask({
                    ...event.task,
                    dueDate: moment(end).toISOString(),
                    length: moment(end).diff(moment(start), 'second')
                });
                break;
            }
            case 'workLog': {
                const workLogs = [...(event.task.workLogs || [])];
                const index = workLogs.findIndex(workLog => workLog.id === event.workLogId);

                if (index >= 0) {
                    workLogs[index] = {
                        ...workLogs[index],
                        start: moment(start).toISOString(),
                        end: moment(end).toISOString()
                    };

                    taskApi.updateTask({
                        ...event.task,
                        workLogs
                    });
                }

                break;
            }
            default:
                break;
        }
    };

    const timeRangeFormat = ({ start, end }, culture, local) =>
        local.format(start, settingsApi.settings.timeFormat, culture) + ' – ' + local.format(end, settingsApi.settings.timeFormat, culture);

    return (
        <div
            className="joyride-task-calendar"
            style={{
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
                views={{
                    month: true,
                    week: true,
                    week_list: WeekListView,
                    day: true,
                    agenda: true
                }}
                formats={{
                    selectRangeFormat: timeRangeFormat,
                    eventTimeRangeFormat: timeRangeFormat,
                    eventTimeRangeStartFormat: ({ start }, culture, local) => local.format(start, settingsApi.settings.timeFormat, culture) + ' – ',
                    eventTimeRangeEndFormat: ({ end }, culture, local) => ' – ' + local.format(end, settingsApi.settings.timeFormat, culture),
                    timeGutterFormat: settingsApi.settings.timeFormat,
                    dayHeaderFormat: settingsApi.settings.dateFormat,
                    agendaDateFormat: settingsApi.settings.dateFormat,
                    agendaTimeFormat: settingsApi.settings.timeFormat,
                    agendaTimeRangeFormat: timeRangeFormat
                }}
                components={{
                    event: CalendarEvent,
                    eventWrapper: CalendarEventWrapper,
                    agenda: {
                        event: AgendaCalendarEvent
                    }
                }}
                messages={{
                    week_list: 'Week List'
                }} />
        </div>
    );
}

TaskCalendar.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(TaskCalendar, () => ({
    appApi: useAppApi(),
    settingsApi: useSettingsApi(),
    taskApi: useTaskApi(),
    taskFieldApi: useTaskFieldApi(),
    taskTemplateApi: useTaskTemplateApi()
}));