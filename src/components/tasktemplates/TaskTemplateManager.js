import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import TaskTemplateList from 'components/tasktemplates/TaskTemplateList';
import TaskTemplateForm from 'components/tasktemplates/TaskTemplateForm';
import withProCheck from 'containers/WithProCheck';
import withSettings from 'containers/WithSettings';
import { useTaskTemplates } from 'hooks/UseTaskTemplates';
import { SettingsPropType } from 'proptypes/SettingPropTypes';

function TaskTemplateManager(props) {
    const taskTemplatesApi = useTaskTemplates();
    const selectedTaskTemplateId = props.taskTemplateId;

    const onAddTaskTemplate = async taskTemplate => {
        taskTemplate = await taskTemplatesApi.addTaskTemplate(taskTemplate);
        props.onTaskTemplateSelection(taskTemplate.id);
    };

    const onDuplicateTaskTemplate = async taskTemplate => {
        taskTemplate = await taskTemplatesApi.duplicateTaskTemplate(taskTemplate);
        props.onTaskTemplateSelection(taskTemplate.id);
    };

    const onTaskTemplateSelection = taskTemplate => {
        props.onTaskTemplateSelection(taskTemplate.id);
    };

    const selectedTaskTemplate = taskTemplatesApi.taskTemplates.find(taskTemplate => taskTemplate.id === selectedTaskTemplateId);

    return (
        <Row>
            <Col span={6}>
                <TaskTemplateList
                    taskTemplates={taskTemplatesApi.taskTemplates}
                    selectedTaskTemplateId={selectedTaskTemplateId}
                    addTaskTemplate={onAddTaskTemplate}
                    duplicateTaskTemplate={onDuplicateTaskTemplate}
                    deleteTaskTemplate={taskTemplatesApi.deleteTaskTemplate}
                    onTaskTemplateSelection={onTaskTemplateSelection}
                    settings={props.settings}
                    updateSettings={props.updateSettings} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTaskTemplate ? (
                    <TaskTemplateForm key={selectedTaskTemplateId} taskTemplate={selectedTaskTemplate} updateTaskTemplate={taskTemplatesApi.updateTaskTemplate} />
                ) : <Empty description="Please select a task template" />}
            </Col>
        </Row>
    );
}

TaskTemplateManager.propTypes = {
    taskTemplateId: PropTypes.string,
    settings: SettingsPropType.isRequired,
    onTaskTemplateSelection: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withProCheck(withSettings(TaskTemplateManager));