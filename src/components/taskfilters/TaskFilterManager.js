import React from 'react';
import PropTypes from 'prop-types';
import { Col, Divider, Empty, Row } from 'antd';
import withTaskFilters from 'containers/WithTaskFilters';
import TaskFilterList from 'components/taskfilters/TaskFilterList';
import TaskFilterConditionTree from 'components/taskfilters/TaskFilterConditionTree';
import TaskFilterForm from 'components/taskfilters/TaskFilterForm';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';

function TaskFilterManager(props) {
    const selectedTaskFilterId = props.taskFilterId;

    const onAddTaskFilter = taskFilter => {
        props.addTaskFilter(taskFilter).then(id => props.onTaskFilterSelection(id));
    };

    const onTaskFilterSelection = taskFilter => {
        props.onTaskFilterSelection(taskFilter.id);
    };

    const selectedTaskFilter = props.taskFilters.find(taskFilter => taskFilter.id === selectedTaskFilterId);

    return (
        <Row>
            <Col span={6}>
                <TaskFilterList
                    taskFilters={props.taskFilters}
                    selectedTaskFilterId={selectedTaskFilterId}
                    addTaskFilter={onAddTaskFilter}
                    deleteTaskFilter={props.deleteTaskFilter}
                    onTaskFilterSelection={onTaskFilterSelection} />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                {selectedTaskFilter ? (
                    <React.Fragment>
                        <TaskFilterForm
                            key={selectedTaskFilterId}
                            taskFilter={selectedTaskFilter}
                            updateTaskFilter={props.updateTaskFilter} />
                        <Divider />
                        <TaskFilterConditionTree
                            key={'conditionTree_' + selectedTaskFilterId}
                            taskFilter={selectedTaskFilter}
                            updateTaskFilter={props.updateTaskFilter} />
                    </React.Fragment>
                ) : <Empty description="Please select a task filter" />}
            </Col>
        </Row>
    );
}

TaskFilterManager.propTypes = {
    taskFilterId: PropTypes.string,
    taskFilters: PropTypes.arrayOf(TaskFilterPropType).isRequired,
    onTaskFilterSelection: PropTypes.func.isRequired,
    addTaskFilter: PropTypes.func.isRequired,
    updateTaskFilter: PropTypes.func.isRequired,
    deleteTaskFilter: PropTypes.func.isRequired,
};

export default withTaskFilters(TaskFilterManager);