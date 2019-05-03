import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from 'antd';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import withTasks from 'containers/WithTasks';
import withSettings from 'containers/WithSettings';
import { TaskTitle } from 'components/tasks/common/TaskTitle';
import 'components/tasks/calendar/TaskCalendar.css';

function TaskCalendar(props) {
    const getCellRender = unit => value => {
        const tasks = props.tasks.filter(task => {
            if (!task.startDate) {
                return false;
            }

            return moment(task.startDate).isSame(value, unit);
        });

        return (
            <ul className="task-list">
                {tasks.map(task => (
                    <li
                        key={task.id}
                        onClick={() => props.setSelectedTaskIds([task.id])}
                        className={props.selectedTaskIds.includes(task.id) ? 'selected' : ''}>
                        <TaskTitle
                            task={task}
                            settings={props.settings}
                            style={{
                                display: 'block',
                                width: '100%'
                            }} />
                    </li>
                ))}
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
    tasks: PropTypes.arrayOf(TaskPropType).isRequired,
    settings: PropTypes.object.isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired
};

export default withSettings(withTasks(TaskCalendar, { applySelectedTaskFilter: true }));