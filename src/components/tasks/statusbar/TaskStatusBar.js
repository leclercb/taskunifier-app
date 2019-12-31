import React from 'react';
import { Progress } from 'antd';
import MediaQuery from 'react-responsive';
import { useTaskApi } from 'hooks/UseTaskApi';
import { toStringDuration } from 'utils/StringUtils';
import 'components/tasks/statusbar/TaskStatusBar.css';

function TaskStatusBar() {
    const taskApi = useTaskApi();

    const createStatsElement = (title, stats) => (
        <React.Fragment>
            <div className="task-status-bar-element">
                <strong>{title}</strong>
                <span> - </span>
                <strong>#</strong>
                <span> Total: </span>
                <strong>{stats.nbTotal}</strong>
                <span> - </span>
                <strong>#</strong>
                <span> Completed: </span>
                <strong>{stats.nbCompleted}</strong>
                <span> - </span>
                <Progress percent={stats.nbTotal === 0 ? 100 : Math.round(100 * stats.nbCompleted / stats.nbTotal)} style={{ width: 60 }} />
            </div>
            <div className="task-status-bar-element">
                <strong>{title}</strong>
                <span> - Total Length: </span>
                <strong>{toStringDuration(stats.length, false, false)}</strong>
                <span> - Total Ellapsed: </span>
                <strong>{toStringDuration(stats.ellapsed, false, false)}</strong>
                <span> - </span>
                <Progress percent={stats.length === 0 ? 100 : Math.round(100 * stats.ellapsed / stats.length)} style={{ width: 60 }} />
            </div>
        </React.Fragment>
    );

    return (
        <div className="task-status-bar">
            <MediaQuery minWidth={1500}>
                {createStatsElement('All', taskApi.statistics.tasks)}
            </MediaQuery>
            {createStatsElement('Selected Filter', taskApi.statistics.filteredTasks)}
        </div>
    );
}

export default TaskStatusBar; 