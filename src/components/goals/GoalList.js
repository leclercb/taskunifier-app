import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import { createAction, createActions } from 'utils/CategoryListUtils';
import Spacer from 'components/common/Spacer';
import Constants from 'constants/Constants';

function GoalList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.goals}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onGoalSelection(item)}
                        className={item.id === props.selectedGoalId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.duplicateGoal(item), () => props.deleteGoal(item.id))}>
                            {item.archived ? createAction(
                                'archive',
                                `"${item.title}" is archived`,
                                null,
                                Constants.archivedColor
                            ) : null}
                            <Spacer />
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addGoal()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

GoalList.propTypes = {
    goals: PropTypes.array.isRequired,
    selectedGoalId: PropTypes.string,
    addGoal: PropTypes.func.isRequired,
    duplicateGoal: PropTypes.func.isRequired,
    deleteGoal: PropTypes.func.isRequired,
    onGoalSelection: PropTypes.func.isRequired
};

export default GoalList;