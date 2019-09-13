import React from 'react';
import { Col, Divider, Empty, Row } from 'antd';
import PropTypes from 'prop-types';
import FilterConditionTree from 'components/filters/FilterConditionTree';
import FilterList from 'components/filters/FilterList';
import FilterForm from 'components/filters/FilterForm';
import SorterTable from 'components/filters/SorterTable';
import withProCheck from 'containers/WithProCheck';
import { getTaskSorterFields } from 'data/DataTaskSorterFields';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { useTaskFilterApi } from 'hooks/UseTaskFilterApi';

function TaskFilterManager(props) {
    const taskFieldApi = useTaskFieldApi();
    const taskFilterApi = useTaskFilterApi();
    const selectedTaskFilterId = props.taskFilterId;

    const onAddTaskFilter = async taskFilter => {
        taskFilter = await taskFilterApi.addTaskFilter(taskFilter);
        props.onTaskFilterSelection(taskFilter.id);
    };

    const onDuplicateTaskFilter = async taskFilter => {
        taskFilter = await taskFilterApi.duplicateTaskFilter(taskFilter);
        props.onTaskFilterSelection(taskFilter.id);
    };

    const onTaskFilterSelection = taskFilter => {
        props.onTaskFilterSelection(taskFilter.id);
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
                    onFilterSelection={onTaskFilterSelection} />
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
    taskFilterId: PropTypes.string,
    onTaskFilterSelection: PropTypes.func.isRequired
};

export default withProCheck(TaskFilterManager);