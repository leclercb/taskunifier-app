import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';

function withTaskTemplate(Component, propertyId = 'taskTemplateId') {
    function WithTaskTemplate(props) {
        return <Component {...props} />
    }

    WithTaskTemplate.propTypes = {
        [propertyId]: PropTypes.string
    }

    const mapStateToProps = (state, ownProps) => ({
        taskTemplate: filterObjects(state.taskTemplates).find(taskTemplate => taskTemplate.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithTaskTemplate);
}

export default withTaskTemplate;