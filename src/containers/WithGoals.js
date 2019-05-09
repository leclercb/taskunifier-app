import { connect } from 'react-redux';
import { addGoal, deleteGoal, updateGoal } from 'actions/GoalActions';
import withBusyCheck from 'containers/WithBusyCheck';
import { getGoalsFilteredByNonArchived, getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';
import { merge } from 'utils/ObjectUtils';

function withGoals(Component, options) {
    options = merge({
        includeState: true,
        includeDispatch: true,
        filteredByNonArchived: false
    }, options || {});

    const mapStateToProps = (state, ownProps) => {
        let goals = getGoalsFilteredByVisibleState(state);

        if (options.filteredByNonArchived === true) {
            goals = getGoalsFilteredByNonArchived(state);
        }

        if ('excludeIds' in ownProps) {
            goals = goals.filter(goal => !ownProps.excludeIds.includes(goal.id));
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
        options.includeState === true ? mapStateToProps : null,
        options.includeDispatch === true ? mapDispatchToProps : null
    )(withBusyCheck(Component));
}

export default withGoals;