import React from 'react';
import SplitPane from 'react-split-pane';
import TaskSider from 'components/tasks/sider/TaskSider';
import TaskTable from 'components/tasks/table/TaskTable';
import TaskQuickAdd from 'components/tasks/quick/TaskQuickAdd';
import TaskTabs from 'components/tasks/tabs/TaskTabs';
import { useSettingsApi } from 'hooks/UseSettingsApi';

function TaskView() {
    const settingsApi = useSettingsApi();

    const onTaskViewSplitPaneSizeChange = size => {
        settingsApi.updateSettings({ taskViewSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    const onTaskViewSubSplitPaneSizeChange = size => {
        settingsApi.updateSettings({ taskViewSubSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    return (
        <SplitPane
            split="vertical"
            minSize={200}
            defaultSize={settingsApi.settings.taskViewSplitPaneSize}
            onDragFinished={size => onTaskViewSplitPaneSizeChange(size)}
            paneStyle={{ overflowY: 'auto' }}>
            <TaskSider mode="table" />
            <SplitPane
                split={settingsApi.settings.taskViewSubSplitPaneMode}
                minSize={200}
                defaultSize={settingsApi.settings.taskViewSubSplitPaneSize}
                onDragFinished={size => onTaskViewSubSplitPaneSizeChange(size)}
                primary="second"
                paneStyle={{ overflowY: 'auto' }}>
                <div style={{ height: '100%' }}>
                    <TaskQuickAdd />
                    <TaskTable />
                </div>
                <div style={{ padding: 10, width: '100%', height: '100%' }}>
                    <TaskTabs />
                </div>
            </SplitPane>
        </SplitPane>
    );
}

export default TaskView;