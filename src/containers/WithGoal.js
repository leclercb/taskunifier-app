import { connect } from 'react-redux';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withGoal(Component, propertyId = 'goalId') {
    const mapStateToProps = (state, ownProps) => ({
        goal: filterObjects(state.goals.all).find(goal => goal.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withGoal;