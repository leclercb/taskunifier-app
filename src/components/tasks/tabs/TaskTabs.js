import React from 'react';
import { Empty, Tabs } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import LinkedObjectTable from 'components/tasks/linkedobject/LinkedObjectTable';
import TaskTextForm from 'components/tasks/text/TaskTextForm';
import WorkLogTable from 'components/tasks/worklogs/WorkLogTable';
import withBusyCheck from 'containers/WithBusyCheck';
import { getLinkedContactFields } from 'data/DataLinkedContactFields';
import { getLinkedFileFields } from 'data/DataLinkedFileFields';
import { getLinkedTaskFields } from 'data/DataLinkedTaskFields';
import { useTaskApi } from 'hooks/UseTaskApi';
import 'components/tasks/tabs/TaskTabs.css';

function TaskTabs({ apis }) {
    const { taskApi } = apis;

    if (taskApi.selectedTasks.length !== 1) {
        return (
            <Empty
                description="Please select one task"
                className="joyride-task-tabs" />
        );
    }

    const onUpdateLinkedContacts = linkedContacts => {
        taskApi.updateTask({
            ...taskApi.selectedTasks[0],
            linkedContacts
        });
    };

    const onUpdateLinkedFiles = linkedFiles => {
        taskApi.updateTask({
            ...taskApi.selectedTasks[0],
            linkedFiles
        });
    };

    const onUpdateLinkedTasks = linkedTasks => {
        taskApi.updateTask({
            ...taskApi.selectedTasks[0],
            linkedTasks
        });
    };

    const onUpdateWorkLogs = workLogs => {
        taskApi.updateTask({
            ...taskApi.selectedTasks[0],
            workLogs
        });
    };

    const onUpdateTotalLength = totalLength => {
        const task = taskApi.selectedTasks[0];

        taskApi.updateTask({
            ...task,
            timer: {
                startDate: task.timer && task.timer && task.timer.startDate ? moment().toISOString() : null,
                value: totalLength
            }
        });
    };

    return (
        <Tabs
            animated={false}
            size="small"
            className="ant-tabs-full-height joyride-task-tabs">
            <Tabs.TabPane tab="Text" key="text">
                <TaskTextForm
                    task={taskApi.selectedTasks[0]}
                    updateTask={taskApi.updateTask} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Contacts" key="linkedContacts">
                <LinkedObjectTable
                    linkedObjectFields={getLinkedContactFields()}
                    linkedObjects={taskApi.selectedTasks[0].linkedContacts || []}
                    updateLinkedObjects={onUpdateLinkedContacts}
                    orderSettingPrefix="linkedContactColumnOrder_"
                    widthSettingPrefix="linkedContactColumnWidth_" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Files" key="linkedFiles">
                <LinkedObjectTable
                    linkedObjectFields={getLinkedFileFields()}
                    linkedObjects={taskApi.selectedTasks[0].linkedFiles || []}
                    updateLinkedObjects={onUpdateLinkedFiles}
                    orderSettingPrefix="linkedFileColumnOrder_"
                    widthSettingPrefix="linkedFileColumnWidth_" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Tasks" key="linkedTasks">
                <LinkedObjectTable
                    linkedObjectFields={getLinkedTaskFields()}
                    linkedObjects={taskApi.selectedTasks[0].linkedTasks || []}
                    updateLinkedObjects={onUpdateLinkedTasks}
                    orderSettingPrefix="linkedTaskColumnOrder_"
                    widthSettingPrefix="linkedTaskColumnWidth_" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Work Log" key="workLogs">
                <WorkLogTable
                    timer={taskApi.selectedTasks[0].timer}
                    workLogs={taskApi.selectedTasks[0].workLogs || []}
                    updateWorkLogs={onUpdateWorkLogs}
                    updateTotalLength={onUpdateTotalLength} />
            </Tabs.TabPane>
        </Tabs>
    );
}

TaskTabs.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(TaskTabs, () => ({
    taskApi: useTaskApi()
}));