import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withGoal(Component, propertyId = 'goalId') {
    const mapStateToProps = (state, ownProps) => ({
        goal: state.goals.filteredByVisibleState.find(goal => goal.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withGoal;