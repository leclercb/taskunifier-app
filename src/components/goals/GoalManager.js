import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Empty } from 'antd';
import withGoals from '../../containers/WithGoals';
import GoalList from './GoalList';
import GoalForm from './GoalForm';

function GoalManager(props) {
    const selectedGoalId = props.goalId;

    const onAddGoal = goal => {
        props.addGoal(goal).then(id => props.onGoalSelection(id));
    }

    const onGoalSelection = goal => {
        props.onGoalSelection(goal.id);
    }

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
            <Col span={2}>

            </Col>
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
    onGoalSelection: PropTypes.func.isRequired
};

export default withGoals(GoalManager);