import React from 'react';
import { Empty, Tabs } from 'antd';
import LinkedObjectTable from 'components/tasks/linkedobject/LinkedObjectTable';
import TaskTextForm from 'components/tasks/text/TaskTextForm';
import { getLinkedContactFields } from 'data/DataLinkedContactFields';
import { getLinkedFileFields } from 'data/DataLinkedFileFields';
import { getLinkedTaskFields } from 'data/DataLinkedTaskFields';
import { useTaskApi } from 'hooks/UseTaskApi';
import 'components/tasks/tabs/TaskTabs.css';

function TaskTabs() {
    const taskApi = useTaskApi();

    if (taskApi.selectedTasks.length !== 1) {
        return (
            <Empty description="Please select one task" />
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

    return (
        <Tabs animated={false} className="ant-tabs-full-height">
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
        </Tabs>
    );
}

export default TaskTabs;