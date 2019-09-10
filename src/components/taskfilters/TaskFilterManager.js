import React from 'react';
import { Col, Divider, Empty, Form, Row } from 'antd';
import PropTypes from 'prop-types';
import FilterConditionTree from 'components/filters/FilterConditionTree';
import FilterList from 'components/filters/FilterList';
import FilterForm from 'components/filters/FilterForm';
import SorterTable from 'components/filters/SorterTable';
import TaskTemplateSelect from 'components/tasktemplates/TaskTemplateSelect';
import withProCheck from 'containers/WithProCheck';
import withTaskFields from 'containers/WithTaskFields';
import withTaskFilters from 'containers/WithTaskFilters';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';
import { getTaskSorterFields } from 'data/DataTaskSorterFields';
import { FieldPropType } from 'proptypes/FieldPropTypes';

function TaskFilterManager(props) {
    const selectedTaskFilterId = props.taskFilterId;

    const onAddTaskFilter = async taskFilter => {
        taskFilter = await props.addTaskFilter(taskFilter);
        props.onTaskFilterSelection(taskFilter.id);
    };

    const onDuplicateTaskFilter = async taskFilter => {
        taskFilter = await props.duplicateTaskFilter(taskFilter);
        props.onTaskFilterSelection(taskFilter.id);
    };

    const onTaskFilterSelection = taskFilter => {
        props.onTaskFilterSelection(taskFilter.id);
    };

    const onUpdateSorters = sorters => {
        props.updateTaskFilter({
            ...selectedTaskFilter,
            sorters
        });
    };

    const selectedTaskFilter = props.taskFilters.find(taskFilter => taskFilter.id === selectedTaskFilterId);

    return (
        <Row>
            <Col span={6}>
                <FilterList
                    filters={props.taskFilters}
                    selectedFilterId={selectedTaskFilterId}
                    addFilter={onAddTaskFilter}
                    duplicateTaskFilter={onDuplicateTaskFilter}
                    deleteFilter={props.deleteTaskFilter}
                    onFilterSelection={onTaskFilterSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTaskFilter ? (
                    <React.Fragment>
                        <FilterForm
                            key={selectedTaskFilterId}
                            filter={selectedTaskFilter}
                            updateFilter={props.updateTaskFilter}
                            extraFields={(props, getFieldDecorator, onCommit) => {
                                /* eslint-disable react/prop-types */
                                return (
                                    <Form.Item label="Task Template">
                                        {getFieldDecorator('taskTemplate', {
                                            initialValue: props.filter.taskTemplate
                                        })(
                                            <TaskTemplateSelect onBlur={onCommit} />
                                        )}
                                    </Form.Item>
                                );
                                /* eslint-enable react/prop-types */
                            }} />
                        <Divider>Filters</Divider>
                        <FilterConditionTree
                            key={'conditionTree_' + selectedTaskFilterId}
                            filter={selectedTaskFilter}
                            context={{
                                fields: props.taskFields
                            }}
                            updateFilter={props.updateTaskFilter} />
                        <Divider>Sorters</Divider>
                        <SorterTable
                            key={'sorterTable_' + selectedTaskFilterId}
                            sorters={selectedTaskFilter.sorters || []}
                            sorterFields={getTaskSorterFields()}
                            updateSorters={onUpdateSorters}
                            orderSettingPrefix="taskSorterColumnOrder_"
                            widthSettingPrefix="taskSorterColumnWidth_" />
                    </React.Fragment>
                ) : <Empty description="Please select a task filter" />}
            </Col>
        </Row>
    );
}

TaskFilterManager.propTypes = {
    taskFilterId: PropTypes.string,
    taskFilters: PropTypes.arrayOf(TaskFilterPropType.isRequired).isRequired,
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    onTaskFilterSelection: PropTypes.func.isRequired,
    addTaskFilter: PropTypes.func.isRequired,
    duplicateTaskFilter: PropTypes.func.isRequired,
    updateTaskFilter: PropTypes.func.isRequired,
    deleteTaskFilter: PropTypes.func.isRequired
};

export default withProCheck(withTaskFields(withTaskFilters(TaskFilterManager)));