import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withTaskTemplates from 'containers/WithTaskTemplates';
import TaskTemplateList from 'components/tasktemplates/TaskTemplateList';
import TaskTemplateForm from 'components/tasktemplates/TaskTemplateForm';
import withSettings from 'containers/WithSettings';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';

function TaskTemplateManager(props) {
    const selectedTaskTemplateId = props.taskTemplateId;

    const onAddTaskTemplate = taskTemplate => {
        props.addTaskTemplate(taskTemplate).then(id => props.onTaskTemplateSelection(id));
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
            <Col span={2}>

            </Col>
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
    settings: PropTypes.object.isRequired,
    onTaskTemplateSelection: PropTypes.func.isRequired,
    addTaskTemplate: PropTypes.func.isRequired,
    updateTaskTemplate: PropTypes.func.isRequired,
    deleteTaskTemplate: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default withSettings(withTaskTemplates(TaskTemplateManager));