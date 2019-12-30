import React from 'react';
import { Alert, Divider, Empty } from 'antd';
import FilterConditionTree from 'components/filters/FilterConditionTree';
import FilterForm from 'components/filters/FilterForm';
import SorterTable from 'components/filters/SorterTable';
import { getTaskSorterFields } from 'data/DataTaskSorterFields';
import { useTaskFieldApi } from 'hooks/UseTaskFieldApi';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';

function TaskFilterInfo({ taskFilter }) {
    const taskFieldApi = useTaskFieldApi();

    if (!taskFilter) {
        return (<Empty />);
    }

    return (
        <React.Fragment>
            <Alert
                type="info"
                message="The general filters are read only."
                showIcon
                style={{ marginBottom: 10 }} />
            <FilterForm
                filter={taskFilter}
                disabled={true} />
            <Divider>Filters</Divider>
            <FilterConditionTree
                filter={taskFilter}
                context={{
                    fields: taskFieldApi.taskFields
                }}
                disabled={true} />
            <Divider>Sorters</Divider>
            <SorterTable
                sorters={taskFilter.sorters || []}
                sorterFields={getTaskSorterFields()}
                orderSettingPrefix="taskSorterColumnOrder_"
                widthSettingPrefix="taskSorterColumnWidth_"
                disabled={true} />
        </React.Fragment>
    );
}

TaskFilterInfo.propTypes = {
    taskFilter: TaskFilterPropType
};

export default TaskFilterInfo;