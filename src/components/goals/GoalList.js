import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, Popconfirm } from 'antd';
import Icon from '../common/Icon';
import LeftRight from '../common/LeftRight';

function GoalList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.goals}
                style={{ minHeight: 400, maxHeight: 400, overflowY: "auto" }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onGoalSelection(item)}
                        className={item.id === props.selectedGoalId ? 'selected-list-item' : null}>
                        <LeftRight right={(
                            <Popconfirm
                                title={`Do you really want to delete "${item.title}" ?`}
                                onConfirm={() => props.deleteGoal(item.id)}
                                okText="Yes"
                                cancelText="No">
                                <Icon
                                    icon="trash-alt"
                                    color="#e3f2eb"
                                    className="object-actions" />
                            </Popconfirm>
                        )}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addGoal()} style={{ marginTop: 5 }}><Icon icon="plus" text="Add" /></Button>
        </React.Fragment>
    );
}

GoalList.propTypes = {
    goals: PropTypes.array.isRequired,
    selectedGoalId: PropTypes.string,
    addGoal: PropTypes.func.isRequired,
    deleteGoal: PropTypes.func.isRequired,
    onGoalSelection: PropTypes.func.isRequired
}

export default GoalList;