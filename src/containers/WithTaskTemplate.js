import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withTaskTemplate(Component, getId = ownProps => ownProps.taskTemplateId) {
    const mapStateToProps = (state, ownProps) => ({
        taskTemplate: state.taskTemplates.filteredByVisibleState.find(taskTemplate => taskTemplate.id === getId(ownProps))
    });

    return connect(
        mapStateToProps,
        null
    )(withBusyCheck(Component));
}

export default withTaskTemplate;