import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withGoal(Component, getId = ownProps => ownProps.goalId) {
    const mapStateToProps = (state, ownProps) => ({
        goal: state.goals.filteredByVisibleState.find(goal => goal.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withGoal;