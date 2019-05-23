import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withTaskFields from 'containers/WithTaskFields';
import TaskFieldList from 'components/taskfields/TaskFieldList';
import TaskFieldForm from 'components/taskfields/TaskFieldForm';
import { FieldPropType } from 'proptypes/FieldPropTypes';

function TaskFieldManager(props) {
    const selectedTaskFieldId = props.taskFieldId;

    const onAddTaskField = taskField => {
        props.addTaskField(taskField).then(taskField => props.onTaskFieldSelection(taskField.id));
    };

    const onTaskFieldSelection = taskField => {
        props.onTaskFieldSelection(taskField.id);
    };

    const selectedTaskField = props.taskFields.find(taskField => taskField.id === selectedTaskFieldId);

    return (
        <Row>
            <Col span={6}>
                <TaskFieldList
                    taskFields={props.taskFields}
                    selectedTaskFieldId={selectedTaskFieldId}
                    addTaskField={onAddTaskField}
                    deleteTaskField={props.deleteTaskField}
                    onTaskFieldSelection={onTaskFieldSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTaskField ? (
                    <TaskFieldForm key={selectedTaskFieldId} taskField={selectedTaskField} updateTaskField={props.updateTaskField} />
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
    updateTaskField: PropTypes.func.isRequired,
    deleteTaskField: PropTypes.func.isRequired
};

export default withTaskFields(TaskFieldManager);