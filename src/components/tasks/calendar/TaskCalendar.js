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

function TaskCalendar(props) {
    // eslint-disable-next-line react/display-name
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
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired
};

export default withSettings(withTasks(TaskCalendar, { applySelectedTaskFilter: true }));