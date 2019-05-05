import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { updateTask } from 'actions/TaskActions';

function withTask(Component, propertyId = 'taskId') {
    const mapStateToProps = (state, ownProps) => ({
        task: state.tasks.filteredByVisibleState.find(task => task.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({
        updateTask: task => dispatch(updateTask(task))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withTask;