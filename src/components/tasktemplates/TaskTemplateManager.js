import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import TaskTemplateList from 'components/tasktemplates/TaskTemplateList';
import TaskTemplateForm from 'components/tasktemplates/TaskTemplateForm';
import withProCheck from 'containers/WithProCheck';
import withSettings from 'containers/WithSettings';
import withTaskTemplates from 'containers/WithTaskTemplates';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';

function TaskTemplateManager(props) {
    const selectedTaskTemplateId = props.taskTemplateId;

    const onAddTaskTemplate = async taskTemplate => {
        taskTemplate = await props.addTaskTemplate(taskTemplate);
        props.onTaskTemplateSelection(taskTemplate.id);
    };

    const onTaskTemplateSelection = taskTemplate => {
        props.onTaskTemplateSelection(taskTemplate.id);
    };

    const selectedTaskTemplate = props.taskTemplates.find(taskTemplate => taskTemplate.id === selectedTaskTemplateId);

    return (
        <Row>
            <Col span={6}>
                <TaskTemplateList
                    taskTemplates={props.taskTemplates}
                    selectedTaskTemplateId={selectedTaskTemplateId}
                    addTaskTemplate={onAddTaskTemplate}
                    deleteTaskTemplate={props.deleteTaskTemplate}
                    onTaskTemplateSelection={onTaskTemplateSelection}
                    settings={props.settings}
                    updateSettings={props.updateSettings} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTaskTemplate ? (
                    <TaskTemplateForm key={selectedTaskTemplateId} taskTemplate={selectedTaskTemplate} updateTaskTemplate={props.updateTaskTemplate} />
                ) : <Empty description="Please select a task template" />}
            </Col>
        </Row>
    );
}

TaskTemplateManager.propTypes = {
    taskTemplateId: PropTypes.string,
    taskTemplates: PropTypes.arrayOf(TaskTemplatePropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired,
    onTaskTemplateSelection: PropTypes.func.isRequired,
    addTaskTemplate: PropTypes.func.isRequired,
    updateTaskTemplate: PropTypes.func.isRequired,
    deleteTaskTemplate: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withProCheck(withSettings(withTaskTemplates(TaskTemplateManager)));