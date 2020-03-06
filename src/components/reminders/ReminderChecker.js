import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTaskReminderApi } from 'hooks/UseTaskReminderApi';

function ReminderChecker({ date, show }) {
    const taskReminderApi = useTaskReminderApi(date);

    const [remindedTasks, setRemindedTasks] = useState([]);

    useEffect(() => {
        const newTasks = taskReminderApi.tasks.filter(task => !remindedTasks.find(remindedTask => remindedTask.id === task.id));

        if (newTasks.length > 0) {
            show();

            new Notification('TaskUnifier', {
                body: newTasks.length === 1 ? `Reminder for "${newTasks[0].title}"` : `Reminder for ${newTasks.length} tasks`
            });
        }

        setRemindedTasks(taskReminderApi.tasks);
    }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

    return null;
}

ReminderChecker.propTypes = {
    date: PropTypes.string.isRequired,
    show: PropTypes.func.isRequired
};

export default ReminderChecker;