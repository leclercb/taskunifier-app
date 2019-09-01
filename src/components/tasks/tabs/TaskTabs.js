import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Tabs } from 'antd';
import LinkedObjectTable from 'components/tasks/linkedobject/LinkedObjectTable';
import TaskTextForm from 'components/tasks/text/TaskTextForm';
import withSelectedTasks from 'containers/WithSelectedTasks';
import { getLinkedContactFields } from 'data/DataLinkedContactFields';
import { getLinkedFileFields } from 'data/DataLinkedFileFields';
import { getLinkedTaskFields } from 'data/DataLinkedTaskFields';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import 'components/tasks/tabs/TaskTabs.css';

function TaskTabs(props) {
    if (props.selectedTasks.length !== 1) {
        return (
            <Empty description="Please select one task" />
        );
    }

    const onUpdateLinkedContacts = linkedContacts => {
        props.updateTask({
            ...props.selectedTasks[0],
            linkedContacts
        });
    };

    const onUpdateLinkedFiles = linkedFiles => {
        props.updateTask({
            ...props.selectedTasks[0],
            linkedFiles
        });
    };

    const onUpdateLinkedTasks = linkedTasks => {
        props.updateTask({
            ...props.selectedTasks[0],
            linkedTasks
        });
    };

    return (
        <Tabs animated={false} className="ant-tabs-full-height">
            <Tabs.TabPane tab="Text" key="text">
                <TaskTextForm
                    task={props.selectedTasks[0]}
                    updateTask={props.updateTask} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Contacts" key="linkedContacts">
                <LinkedObjectTable
                    linkedObjectFields={getLinkedContactFields()}
                    linkedObjects={props.selectedTasks[0].linkedContacts || []}
                    updateLinkedObjects={onUpdateLinkedContacts}
                    orderSettingPrefix="linkedContactColumnOrder_"
                    widthSettingPrefix="linkedContactColumnWidth_" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Files" key="linkedFiles">
                <LinkedObjectTable
                    linkedObjectFields={getLinkedFileFields()}
                    linkedObjects={props.selectedTasks[0].linkedFiles || []}
                    updateLinkedObjects={onUpdateLinkedFiles}
                    orderSettingPrefix="linkedFileColumnOrder_"
                    widthSettingPrefix="linkedFileColumnWidth_" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Tasks" key="linkedTasks">
                <LinkedObjectTable
                    linkedObjectFields={getLinkedTaskFields()}
                    linkedObjects={props.selectedTasks[0].linkedTasks || []}
                    updateLinkedObjects={onUpdateLinkedTasks}
                    orderSettingPrefix="linkedTaskColumnOrder_"
                    widthSettingPrefix="linkedTaskColumnWidth_" />
            </Tabs.TabPane>
        </Tabs>
    );
}

TaskTabs.propTypes = {
    selectedTasks: PropTypes.arrayOf(TaskPropType).isRequired,
    setSelectedTaskIds: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired
};

export default withSelectedTasks(TaskTabs);