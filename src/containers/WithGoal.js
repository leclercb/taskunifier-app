import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getGoalsFilteredByVisibleState } from 'selectors/GoalSelectors';

function withGoal(Component, getId = ownProps => ownProps.goalId) {
    const mapStateToProps = (state, ownProps) => ({
        goal: getGoalsFilteredByVisibleState(state).find(goal => goal.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withGoal;