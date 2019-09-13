import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Spacer from 'components/common/Spacer';
import Constants from 'constants/Constants';
import { TaskTemplatePropType } from 'proptypes/TaskTemplatePropTypes';
import { createAction, createActions } from 'utils/CategoryListUtils';

function TaskTemplateList(props) {
    const { defaultTaskTemplate } = props.settings;

    const setDefaultTaskTemplate = () => {
        props.updateSettings({
            defaultTaskTemplate: props.selectedTaskTemplateId
        });
    };

    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.taskTemplates}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onTaskTemplateSelection(item)}
                        className={item.id === props.selectedTaskTemplateId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.duplicateTaskTemplate(item), () => props.deleteTaskTemplate(item.id))}>
                            {defaultTaskTemplate === item.id ? createAction(
                                'star',
                                `"${item.title}" is the default task template`,
                                null,
                                Constants.defaultTaskTemplateColor
                            ) : null}
                            <Spacer />
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addTaskTemplate()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
            <Spacer />
            <Button onClick={() => setDefaultTaskTemplate()} style={{ marginTop: 5 }}>
                <Icon icon="star" text="Set as default" />
            </Button>
        </React.Fragment>
    );
}

TaskTemplateList.propTypes = {
    taskTemplates: PropTypes.arrayOf(TaskTemplatePropType.isRequired).isRequired,
    selectedTaskTemplateId: PropTypes.string,
    addTaskTemplate: PropTypes.func.isRequired,
    duplicateTaskTemplate: PropTypes.func.isRequired,
    deleteTaskTemplate: PropTypes.func.isRequired,
    onTaskTemplateSelection: PropTypes.func.isRequired,
    settings: PropTypes.shape({
        defaultTaskTemplate: PropTypes.string
    }).isRequired,
    updateSettings: PropTypes.func.isRequired
};

export default TaskTemplateList;