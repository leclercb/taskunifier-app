import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withGoals from 'containers/WithGoals';
import GoalList from 'components/goals/GoalList';
import GoalForm from 'components/goals/GoalForm';
import { GoalPropType } from 'proptypes/GoalPropTypes';

function GoalManager(props) {
    const selectedGoalId = props.goalId;

    const onAddGoal = goal => {
        props.addGoal(goal).then(id => props.onGoalSelection(id));
    };

    const onGoalSelection = goal => {
        props.onGoalSelection(goal.id);
    };

    const selectedGoal = props.goals.find(goal => goal.id === selectedGoalId);

    return (
        <Row>
            <Col span={6}>
                <GoalList
                    goals={props.goals}
                    selectedGoalId={selectedGoalId}
                    addGoal={onAddGoal}
                    deleteGoal={props.deleteGoal}
                    onGoalSelection={onGoalSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedGoal ? (
                    <GoalForm key={selectedGoalId} goal={selectedGoal} updateGoal={props.updateGoal} />
                ) : <Empty description="Please select a goal" />}
            </Col>
        </Row>
    );
}

GoalManager.propTypes = {
    goalId: PropTypes.string,
    goals: PropTypes.arrayOf(GoalPropType.isRequired).isRequired,
    onGoalSelection: PropTypes.func.isRequired,
    addGoal: PropTypes.func.isRequired,
    updateGoal: PropTypes.func.isRequired,
    deleteGoal: PropTypes.func.isRequired
};

export default withGoals(GoalManager);