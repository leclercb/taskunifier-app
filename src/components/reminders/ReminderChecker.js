import { useEffect } from 'react';
import PropTypes from 'prop-types';
import withTaskReminders from 'containers/WithTaskReminders';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { usePrevious } from 'hooks/UsePrevious';

function ReminderChecker(props) {
    const prevTasks = usePrevious(props.tasks) || [];

    useEffect(() => {
        const prevTaskIds = prevTasks.map(task => task.id);
        const taskIds = props.tasks.map(task => task.id);

        if (!taskIds.every(taskId => prevTaskIds.includes(taskId))) {
            props.show();
        }
    });

    return null;
}

ReminderChecker.propTypes = {
    date: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    show: PropTypes.func.isRequired
};

export default withTaskReminders(ReminderChecker);