import React from 'react';
import { connect } from 'react-redux';
import { addGoal, updateGoal, deleteGoal } from '../actions/GoalActions';

const mapStateToProps = state => ({
    goals: state.goals
});

const mapDispatchToProps = dispatch => ({
    addGoal: goal => dispatch(addGoal(goal)),
    updateGoal: goal => dispatch(updateGoal(goal)),
    deleteGoal: goalId => dispatch(deleteGoal(goalId))
});

function withGoals(Component) {
    function WithGoals(props) {
        return <Component {...props} />
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithGoals);
}

export default withGoals;