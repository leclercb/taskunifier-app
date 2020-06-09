import React from 'react';
import { Col, Divider, Empty, Row } from 'antd';
import PropTypes from 'prop-types';
import FilterConditionTree from 'components/filters/FilterConditionTree';
import FilterForm from 'components/filters/FilterForm';
import FilterList from 'components/filters/FilterList';
import SorterTable from 'components/filters/SorterTable';
import withBusyCheck from 'containers/WithBusyCheck';
import withProCheck from 'containers/WithProCheck';
import { getTaskSorterFields } from 'data/DataTaskSorterFields';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useTaskFilterApi } from 'hooks/UseTaskFilterApi';

function TaskFilterManager({ apis, taskFilterId, onTaskFilterSelection }) {
    const { taskFieldApi, taskFilterApi } = apis;
    const selectedTaskFilterId = taskFilterId;

    const onAddTaskFilter = async taskFilter => {
        taskFilter = await taskFilterApi.addTaskFilter(taskFilter);
        onTaskFilterSelection(taskFilter.id);
    };

    const onDuplicateTaskFilter = async taskFilter => {
        taskFilter = await taskFilterApi.duplicateTaskFilter(taskFilter);
        onTaskFilterSelection(taskFilter.id);
    };

    const onUpdateSorters = sorters => {
        taskFilterApi.updateTaskFilter({
            ...selectedTaskFilter,
            sorters
        });
    };

    const selectedTaskFilter = taskFilterApi.taskFilters.find(taskFilter => taskFilter.id === selectedTaskFilterId);

    return (
        <Row>
            <Col span={6}>
                <FilterList
                    filters={taskFilterApi.taskFilters}
                    selectedFilterId={selectedTaskFilterId}
                    addFilter={onAddTaskFilter}
                    duplicateFilter={onDuplicateTaskFilter}
                    deleteFilter={taskFilterApi.deleteTaskFilter}
                    onFilterSelection={taskFilter => onTaskFilterSelection(taskFilter.id)} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTaskFilter ? (
                    <React.Fragment>
                        <FilterForm
                            key={selectedTaskFilterId}
                            filter={selectedTaskFilter}
                            updateFilter={taskFilterApi.updateTaskFilter} />
                        <Divider>Filters</Divider>
                        <FilterConditionTree
                            key={'conditionTree_' + selectedTaskFilterId}
                            filter={selectedTaskFilter}
                            context={{
                                fields: taskFieldApi.taskFields
                            }}
                            updateFilter={taskFilterApi.updateTaskFilter} />
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
    apis: PropTypes.object.isRequired,
    taskFilterId: PropTypes.string,
    onTaskFilterSelection: PropTypes.func.isRequired
};

export default withProCheck(withBusyCheck(TaskFilterManager, () => ({
    taskFieldApi: useTaskFieldApi(),
    taskFilterApi: useTaskFilterApi()
})));