import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, Popconfirm } from 'antd';
import Icon from '../common/Icon';
import LeftRight from '../common/LeftRight';
import Constants from '../constants/Constants';

function TaskTemplateList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.taskTemplates}
                style={{ minHeight: 400, maxHeight: 400, overflowY: "auto" }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onTaskTemplateSelection(item)}
                        className={item.id === props.selectedTaskTemplateId ? 'selected-list-item' : null}>
                        <LeftRight right={(
                            <Popconfirm
                                title={`Do you really want to delete "${item.title}" ?`}
                                onConfirm={() => props.deleteTaskTemplate(item.id)}
                                okText="Yes"
                                cancelText="No">
                                <Icon
                                    icon="trash-alt"
                                    color={Constants.fadeColor}
                                    className="object-actions" />
                            </Popconfirm>
                        )}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addTaskTemplate()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

TaskTemplateList.propTypes = {
    taskTemplates: PropTypes.array.isRequired,
    selectedTaskTemplateId: PropTypes.string,
    addTaskTemplate: PropTypes.func.isRequired,
    deleteTaskTemplate: PropTypes.func.isRequired,
    onTaskTemplateSelection: PropTypes.func.isRequired
};

export default TaskTemplateList;