import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import { TaskTitle } from 'components/tasks/common/TaskTitle';
import 'components/tasks/calendar/TaskCalendar.css';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';

const localizer = BigCalendar.momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

function TaskCalendar(props) {
    const getEvents = () => {
        const events = [];

        props.tasks.forEach(task => {
            events.push({
                title: task.title,
                start: moment(task.startDate).toDate(),
                end: moment(task.startDate).add(task.length, 'minutes').toDate()
            });

            events.push({
                title: task.title,
                start: moment(task.dueDate).subtract(task.length, 'minutes').toDate(),
                end: moment(task.dueDate).toDate()
            });
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
        <DnDCalendar
            events={getEvents()}
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            resizable={true}
            selectable={true} />
    );
}

TaskCalendar.propTypes = {
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired
};

export default withSettings(withTasks(TaskCalendar, { applySelectedTaskFilter: true }));