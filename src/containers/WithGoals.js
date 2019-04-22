import { connect } from 'react-redux';
import { addGoal, updateGoal, deleteGoal } from '../actions/GoalActions';
import { filterObjects, filterArchivedObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withGoals(Component, options = { actionsOnly: false, filterArchived: false }) {
    const mapStateToProps = (state, ownProps) => {
        if (options && options.actionsOnly === true) {
            return {
                busy: state.processes.busy
            };
        }

        let goals = filterObjects(state.goals);

        if (options && options.filterArchived === true) {
            goals = filterArchivedObjects(goals);
        }

        if ('excludeIds' in ownProps) {
            goals = goals.filter(goal => !ownProps.excludeIds.includes(goal.id));
        }

        return {
            busy: state.processes.busy,
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
    )(withBusyCheck(Component));
}

export default withGoals;