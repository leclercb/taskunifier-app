import React from 'react';
import { Progress } from 'antd';
import MediaQuery from 'react-responsive';
import Icon from 'components/common/Icon';
import { useAppApi } from 'hooks/UseAppApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useTaskApi } from 'hooks/UseTaskApi';
import { toStringDuration } from 'utils/StringUtils';
import 'components/tasks/statusbar/TaskStatusBar.css';

function TaskStatusBar() {
    const appApi = useAppApi();
    const settingsApi = useSettingsApi();
    const taskApi = useTaskApi();

    const createStatsElement = (title, stats) => (
        <React.Fragment>
            <div className="task-status-bar-element">
                <strong>{title}</strong>
                {settingsApi.settings.showTaskTotalNumber && (
                    <React.Fragment>
                        <span> - </span>
                        <strong>#</strong>
                        <span> Total: </span>
                        <strong>{stats.nbTotal}</strong>
                    </React.Fragment>
                )}
                {settingsApi.settings.showTaskCompletedNumber && (
                    <React.Fragment>
                        <span> - </span>
                        <strong>#</strong>
                        <span> Completed: </span>
                        <strong>{stats.nbCompleted}</strong>
                    </React.Fragment>
                )}
                <span> - </span>
                <Progress percent={stats.nbTotal === 0 ? 100 : Math.round(100 * stats.nbCompleted / stats.nbTotal)} style={{ width: 60 }} />
            </div>
            <div className="task-status-bar-element">
                <strong>{title}</strong>
                {settingsApi.settings.showTaskTotalLength && (
                    <React.Fragment>
                        <span> - Total Length: </span>
                        <strong>{toStringDuration(stats.length, false, false)}</strong>
                    </React.Fragment>
                )}
                {settingsApi.settings.showTaskTotalElapsed && (
                    <React.Fragment>
                        <span> - Total Elapsed: </span>
                        <strong>{toStringDuration(stats.elapsed, false, false)}</strong>
                    </React.Fragment>
                )}
                {settingsApi.settings.showTaskTotalElapsedToday && (
                    <React.Fragment>
                        <span> - Total Today: </span>
                        <strong>{toStringDuration(stats.elapsedToday, false, false)}</strong>
                    </React.Fragment>
                )}
                <span> - </span>
                <Progress percent={stats.length === 0 ? 100 : Math.round(100 * stats.elapsed / stats.length)} style={{ width: 60 }} />
            </div>
        </React.Fragment>
    );

    return (
        <div className="task-status-bar">
            <MediaQuery minWidth={1650}>
                {createStatsElement('All', taskApi.statistics.tasks)}
            </MediaQuery>
            {createStatsElement('Selected Filter', taskApi.statistics.filteredTasks)}
            <div className="task-status-bar-element">
                <Icon icon="cog" onClick={() => appApi.setSettingManagerOptions({ visible: true, category: 'statusBar' })} />
            </div>
        </div>
    );
}

export default TaskStatusBar; 