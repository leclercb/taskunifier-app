import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withTaskTemplate(Component, propertyId = 'taskTemplateId') {
    const mapStateToProps = (state, ownProps) => ({
        taskTemplate: state.taskTemplates.filteredByVisibleState.find(taskTemplate => taskTemplate.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withTaskTemplate;