import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';

function withTaskField(Component, getId = ownProps => ownProps.taskFieldId) {
    const mapStateToProps = (state, ownProps) => ({
        taskField: getTaskFieldsIncludingDefaults(state).find(taskField => taskField.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withTaskField;