import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import GoalList from 'components/goals/GoalList';
import GoalForm from 'components/goals/GoalForm';
import { useGoalApi } from 'hooks/UseGoalApi';

function GoalManager(props) {
    const goalApi = useGoalApi();
    const selectedGoalId = props.goalId;

    const onAddGoal = async goal => {
        goal = await goalApi.addGoal(goal);
        props.onGoalSelection(goal.id);
    };

    const onDuplicateGoal = async goal => {
        goal = await goalApi.duplicateGoal(goal);
        props.onGoalSelection(goal.id);
    };

    const onGoalSelection = goal => {
        props.onGoalSelection(goal.id);
    };

    const selectedGoal = goalApi.goals.find(goal => goal.id === selectedGoalId);

    return (
        <Row>
            <Col span={6}>
                <GoalList
                    goals={goalApi.goals}
                    selectedGoalId={selectedGoalId}
                    addGoal={onAddGoal}
                    duplicateGoal={onDuplicateGoal}
                    deleteGoal={goalApi.deleteGoal}
                    onGoalSelection={onGoalSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedGoal ? (
                    <GoalForm key={selectedGoalId} goal={selectedGoal} updateGoal={goalApi.updateGoal} />
                ) : <Empty description="Please select a goal" />}
            </Col>
        </Row>
    );
}

GoalManager.propTypes = {
    goalId: PropTypes.string,
    onGoalSelection: PropTypes.func.isRequired
};

export default GoalManager;