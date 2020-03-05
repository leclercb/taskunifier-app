import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePrevious } from 'hooks/UsePrevious';
import { useTaskReminderApi } from 'hooks/UseTaskReminderApi';

function ReminderChecker({ date, show }) {
    const taskReminderApi = useTaskReminderApi(date);
    const prevTasks = usePrevious(taskReminderApi.tasks) || [];

    useEffect(() => {
        const newTasks = taskReminderApi.tasks.filter(task => !prevTasks.find(prevTask => prevTask.id === task.id));

        if (newTasks.length > 0) {
            show();
            new Notification('There are new reminders !');
        }
    }, [taskReminderApi.tasks]); // eslint-disable-line react-hooks/exhaustive-deps

    return null;
}

ReminderChecker.propTypes = {
    date: PropTypes.string.isRequired,
    show: PropTypes.func.isRequired
};

export default ReminderChecker;