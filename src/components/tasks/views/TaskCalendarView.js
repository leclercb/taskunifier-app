import React from 'react';
import SplitPane from 'react-split-pane';
import TaskSider from 'components/tasks/sider/TaskSider';
import TaskCalendar from 'components/tasks/calendar/TaskCalendar';
import TaskQuickAdd from 'components/tasks/quick/TaskQuickAdd';
import TaskTabs from 'components/tasks/tabs/TaskTabs';
import { useSettingsApi } from 'hooks/UseSettingsApi';

function TaskCalendarView() {
    const settingsApi = useSettingsApi();

    const onTaskCalendarViewSplitPaneSizeChange = size => {
        settingsApi.updateSettings({ taskCalendarViewSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    const onTaskCalendarViewSubSplitPaneSizeChange = size => {
        settingsApi.updateSettings({ taskCalendarViewSubSplitPaneSize: size });
        window.dispatchEvent(new Event('app-resize'));
    };

    return (
        <SplitPane
            split="vertical"
            minSize={200}
            defaultSize={settingsApi.settings.taskCalendarViewSplitPaneSize}
            onDragFinished={size => onTaskCalendarViewSplitPaneSizeChange(size)}
            paneStyle={{ overflowY: 'auto' }}>
            <TaskSider mode="calendar" />
            <SplitPane
                split={settingsApi.settings.taskCalendarViewSubSplitPaneMode}
                minSize={200}
                defaultSize={settingsApi.settings.taskCalendarViewSubSplitPaneSize}
                onDragFinished={size => onTaskCalendarViewSubSplitPaneSizeChange(size)}
                primary="second"
                paneStyle={{ overflowY: 'auto' }}>
                <div style={{ height: '100%' }}>
                    <TaskQuickAdd />
                    <TaskCalendar />
                </div>
                <div style={{ padding: 10, width: '100%' }}>
                    <TaskTabs />
                </div>
            </SplitPane>
        </SplitPane>
    );
}

export default TaskCalendarView;