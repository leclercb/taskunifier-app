import React from 'react';
import { connect } from 'react-redux';
import { addGoal, updateGoal, deleteGoal } from '../actions/GoalActions';
import { filterObjects, filterArchivedObjects } from '../utils/CategoryUtils';

function withGoals(Component, options = { actionsOnly: false, filterArchived: false }) {
    function WithGoals(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => {
        if (options && options.actionsOnly === true) {
            return {};
        }

        let goals = filterObjects(state.goals);

        if (options && options.filterArchived === true) {
            goals = filterArchivedObjects(goals);
        }

        return {
            goals: goals
        };
    };

    const mapDispatchToProps = dispatch => ({
        addGoal: goal => dispatch(addGoal(goal)),
        updateGoal: goal => dispatch(updateGoal(goal)),
        deleteGoal: goalId => dispatch(deleteGoal(goalId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithGoals);
}

export default withGoals;