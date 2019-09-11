import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withTaskFields from 'containers/WithTaskFields';
import withProCheck from 'containers/WithProCheck';
import FieldList from 'components/fields/FieldList';
import FieldForm from 'components/fields/FieldForm';
import { useTasks } from 'hooks/UseTasks';
import { FieldPropType } from 'proptypes/FieldPropTypes';

function TaskFieldManager(props) {
    const taskApi = useTasks();
    const selectedTaskFieldId = props.taskFieldId;

    const onAddTaskField = async taskField => {
        taskField = await props.addTaskField(taskField);
        props.onTaskFieldSelection(taskField.id);
    };

    const onDuplicateTaskField = async taskField => {
        taskField = await props.duplicateTaskField(taskField);
        props.onTaskFieldSelection(taskField.id);
    };

    const onTaskFieldSelection = taskField => {
        props.onTaskFieldSelection(taskField.id);
    };

    const selectedTaskField = props.taskFields.find(taskField => taskField.id === selectedTaskFieldId);

    return (
        <Row>
            <Col span={6}>
                <FieldList
                    fields={props.taskFields}
                    selectedFieldId={selectedTaskFieldId}
                    addField={onAddTaskField}
                    duplicateTaskField={onDuplicateTaskField}
                    deleteField={props.deleteTaskField}
                    onFieldSelection={onTaskFieldSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTaskField ? (
                    <FieldForm
                        key={selectedTaskFieldId}
                        objects={taskApi.tasks}
                        field={selectedTaskField}
                        updateField={props.updateTaskField} />
                ) : <Empty description="Please select a task field" />}
            </Col>
        </Row>
    );
}

TaskFieldManager.propTypes = {
    taskFieldId: PropTypes.string,
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    onTaskFieldSelection: PropTypes.func.isRequired,
    addTaskField: PropTypes.func.isRequired,
    duplicateTaskField: PropTypes.func.isRequired,
    updateTaskField: PropTypes.func.isRequired,
    deleteTaskField: PropTypes.func.isRequired
};

export default withProCheck(withTaskFields(TaskFieldManager));