import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from '../components/common/WithBusyCheck';

function withGoal(Component, propertyId = 'goalId') {
    const mapStateToProps = (state, ownProps) => ({
        goal: filterObjects(state.goals).find(goal => goal.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withGoal;