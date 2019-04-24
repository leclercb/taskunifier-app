import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';
import withBusyCheck from './WithBusyCheck';

function withTaskTemplate(Component, propertyId = 'taskTemplateId') {
    const mapStateToProps = (state, ownProps) => ({
        taskTemplate: filterObjects(state.taskTemplates).find(taskTemplate => taskTemplate.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withTaskTemplate;