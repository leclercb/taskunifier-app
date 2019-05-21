import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import TaskTitle from 'components/tasks/common/TaskTitle';
import withSettings from 'containers/WithSettings';
import withTasks from 'containers/WithTasks';
import { SettingsPropType } from 'proptypes/SettingPropTypes';
import { TaskPropType } from 'proptypes/TaskPropTypes';
import { formatDate } from 'utils/SettingUtils';

function ReminderList(props) {
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);

    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.tasks}
                style={{ minHeight: 300, maxHeight: 300, overflowY: 'auto' }}
                renderItem={task => (
                    <List.Item
                        key={task.id}
                        onClick={() => setSelectedTaskIds([task.id])}
                        className={selectedTaskIds.includes(task.id) ? 'selected-list-item' : null}>
                        <List.Item.Meta
                            title={<TaskTitle taskId={task.id} />}
                            description={(
                                <React.Fragment>
                                    <span style={{ fontStyle: 'italic' }}>
                                        Start date: {task.startDate ? formatDate(task.startDate, props.settings, props.settings.showStartTime) : 'none'}
                                    </span>
                                    <br />
                                    <span style={{ fontStyle: 'italic' }}>
                                        Due date: {task.dueDate ? formatDate(task.dueDate, props.settings, props.settings.showDueTime) : 'none'}
                                    </span>
                                </React.Fragment>
                            )} />
                    </List.Item>
                )}
            />
            <Button onClick={() => { }} style={{ marginTop: 5 }}>
                <Icon icon="eye-slash" text="Dismiss" />
            </Button>
            <Spacer />
            <Button onClick={() => { }} style={{ marginTop: 5 }}>
                <Icon icon="eye-slash" text="Dismiss All" />
            </Button>
        </React.Fragment>
    );
}

ReminderList.propTypes = {
    tasks: PropTypes.arrayOf(TaskPropType.isRequired).isRequired,
    settings: SettingsPropType.isRequired
};

export default withSettings(withTasks(ReminderList));