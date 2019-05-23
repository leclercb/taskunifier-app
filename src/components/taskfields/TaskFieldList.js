import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { createActions } from 'utils/CategoryListUtils';
import { getColorFromIndex } from 'utils/ColorUtils';

function TaskFieldList(props) {
    const onAddTaskField = () => {
        props.addTaskField({
            color: getColorFromIndex(props.taskFields.length),
            type: 'text',
            editable: true
        });
    };

    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.taskFields.filter(taskField => !taskField.static)}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onTaskFieldSelection(item)}
                        className={item.id === props.selectedTaskFieldId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.addTaskField(item), () => props.deleteTaskField(item.id))}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => onAddTaskField()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

TaskFieldList.propTypes = {
    taskFields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    selectedTaskFieldId: PropTypes.string,
    addTaskField: PropTypes.func.isRequired,
    deleteTaskField: PropTypes.func.isRequired,
    onTaskFieldSelection: PropTypes.func.isRequired
};

export default TaskFieldList;