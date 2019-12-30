import React from 'react';
import { Progress } from 'antd';
import moment from 'moment';
import { useTaskApi } from 'hooks/UseTaskApi';
import 'components/tasks/statusbar/TaskStatusBar.css';

function TaskStatusBar() {
    const taskApi = useTaskApi();

    const computeStats = tasks => {
        const stats = { length: 0, ellapsed: 0 };

        for (let task of tasks) {
            if (task.completed) {
                continue;
            }

            stats.length += task.length || 0;
            stats.ellapsed += task.timer ? task.timer.value || 0 : 0;

            if (task.timer && task.timer.startDate) {
                stats.ellapsed += moment().diff(moment(task.timer.startDate), 'second');
            }
        }

        return stats;
    };

    const createStatsElement = (title, stats) => (
        <div className="task-status-bar-element">
            <strong>{title}</strong>
            <span> - Total Length: </span>
            <strong>{(stats.length / 3600).toFixed(2)}</strong>
            <span> hours - Total Ellapsed: </span>
            <strong>{(stats.ellapsed / 3600).toFixed(2)}</strong>
            <span> hours</span>
            {stats.length !== 0 && (
                <React.Fragment>
                    <span> - </span>
                    <Progress percent={Math.round(100 * stats.ellapsed / stats.length)} style={{ width: 120 }} />
                </React.Fragment>
            )}
        </div>
    );

    const overallStats = computeStats(taskApi.tasks);
    const selectedFilterStats = computeStats(taskApi.filteredTasks);

    return (
        <div className="task-status-bar">
            {createStatsElement('Overall', overallStats)}
            {createStatsElement('Selected Filter', selectedFilterStats)}
        </div>
    );
}

export default TaskStatusBar; 