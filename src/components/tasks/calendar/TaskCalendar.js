import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from 'antd';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import { TaskTitle } from 'components/tasks/common/TaskTitle';
import 'components/tasks/calendar/TaskCalendar.css';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import Constants from 'constants/Constants';

function TaskCalendar(props) {
    const matchStartDateMode = (task, unit, value) => {
        return task.startDate &&
            (props.calendarDateMode === 'both' || props.calendarDateMode === 'startDate') &&
            moment(task.startDate).isSame(value, unit);
    }
    const matchDueDateMode = (task, unit, value) => {
        return task.dueDate &&
            (props.calendarDateMode === 'both' || props.calendarDateMode === 'dueDate') &&
            moment(task.dueDate).isSame(value, unit);
    }

    // eslint-disable-next-line react/display-name
    const getCellRender = unit => value => {
        const tasks = props.tasks.filter(task =>
            matchStartDateMode(task, unit, value) || matchDueDateMode(task, unit, value));

        return (
            <ul className="task-list">
                {tasks.map(task => {
                    const matchStartDate = matchStartDateMode(task, unit, value);
                    const matchDueDate = matchDueDateMode(task, unit, value);

                    let mode;

                    if (matchStartDate && matchDueDate) {
                        mode = 'both';
                    } else if (matchStartDate) {
                        mode = 'startDate';
                    } else {
                        mode = 'dueDate';
                    }

                    return (
                        <li
                            key={task.id}
                            onClick={() => props.setSelectedTaskIds([task.id])}
                            className={props.selectedTaskIds.includes(task.id) ? 'selected' : ''}>
                            <TaskTitle
                                task={task}
                                settings={props.settings}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    border: `1px solid ${Constants[`calendarDateMode_${mode}`]}`
                                }} />
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <Calendar
            dateCellRender={getCellRender('day')}
            monthCellRender={getCellRender('month')} />
    );
}

TaskCalendar.propTypes = {
    calendarDateMode: PropTypes.oneOf(['both', 'startDate', 'dueDate']).isRequired,
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired
};

export default withSettings(withTasks(TaskCalendar, { applySelectedTaskFilter: true }));