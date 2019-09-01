import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withTasks from 'containers/WithTasks';
import withTaskFields from 'containers/WithTaskFields';
import withProCheck from 'containers/WithProCheck';
import FieldList from 'components/fields/FieldList';
import FieldForm from 'components/fields/FieldForm';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';

function TaskFieldManager(props) {
    const selectedTaskFieldId = props.taskFieldId;

    const onAddTaskField = async taskField => {
        taskField = await props.addTaskField(taskField);
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
                    deleteField={props.deleteTaskField}
                    onFieldSelection={onTaskFieldSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTaskField ? (
                    <FieldForm
                        key={selectedTaskFieldId}
                        objects={props.tasks}
                        field={selectedTaskField}
                        updateField={props.updateTaskField} />
                ) : <Empty description="Please select a task field" />}
            </Col>
        </Row>
    );
}

TaskFieldManager.propTypes = {
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    taskFieldId: PropTypes.string,
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    onTaskFieldSelection: PropTypes.func.isRequired,
    addTaskField: PropTypes.func.isRequired,
    updateTaskField: PropTypes.func.isRequired,
    deleteTaskField: PropTypes.func.isRequired
};

export default withProCheck(withTaskFields(withTasks(TaskFieldManager)));