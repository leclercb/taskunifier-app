import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';
import { getTaskTemplatesFilteredByVisibleState } from 'selectors/TaskTemplateSelectors';

function withTaskTemplate(Component, getId = ownProps => ownProps.taskTemplateId) {
    const mapStateToProps = (state, ownProps) => ({
        taskTemplate: getTaskTemplatesFilteredByVisibleState(state).find(taskTemplate => taskTemplate.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withTaskTemplate;