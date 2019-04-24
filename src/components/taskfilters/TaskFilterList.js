import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import { createActions } from 'utils/CategoryListUtils';

function TaskFilterList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.taskFilters}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onTaskFilterSelection(item)}
                        className={item.id === props.selectedTaskFilterId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.addTaskFilter(item), () => props.deleteTaskFilter(item.id))}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addTaskFilter()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

TaskFilterList.propTypes = {
    taskFilters: PropTypes.array.isRequired,
    selectedTaskFilterId: PropTypes.string,
    addTaskFilter: PropTypes.func.isRequired,
    deleteTaskFilter: PropTypes.func.isRequired,
    onTaskFilterSelection: PropTypes.func.isRequired
};

export default TaskFilterList;