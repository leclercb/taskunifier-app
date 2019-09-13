import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withProCheck from 'containers/WithProCheck';
import FieldList from 'components/fields/FieldList';
import FieldForm from 'components/fields/FieldForm';
import { useTaskApi } from 'hooks/UseTaskApi';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';

function TaskFieldManager(props) {
    const taskApi = useTaskApi();
    const taskFieldApi = useTaskFieldApi();
    const selectedTaskFieldId = props.taskFieldId;

    const onAddTaskField = async taskField => {
        taskField = await taskFieldApi.addTaskField(taskField);
        props.onTaskFieldSelection(taskField.id);
    };

    const onDuplicateTaskField = async taskField => {
        taskField = await taskFieldApi.duplicateTaskField(taskField);
        props.onTaskFieldSelection(taskField.id);
    };

    const onTaskFieldSelection = taskField => {
        props.onTaskFieldSelection(taskField.id);
    };

    const selectedTaskField = taskFieldApi.taskFields.find(taskField => taskField.id === selectedTaskFieldId);

    return (
        <Row>
            <Col span={6}>
                <FieldList
                    fields={taskFieldApi.taskFields}
                    selectedFieldId={selectedTaskFieldId}
                    addField={onAddTaskField}
                    duplicateField={onDuplicateTaskField}
                    deleteField={taskFieldApi.deleteTaskField}
                    onFieldSelection={onTaskFieldSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTaskField ? (
                    <FieldForm
                        key={selectedTaskFieldId}
                        objects={taskApi.tasks}
                        field={selectedTaskField}
                        updateField={taskFieldApi.updateTaskField} />
                ) : <Empty description="Please select a task field" />}
            </Col>
        </Row>
    );
}

TaskFieldManager.propTypes = {
    taskFieldId: PropTypes.string,
    onTaskFieldSelection: PropTypes.func.isRequired
};

export default withProCheck(TaskFieldManager);