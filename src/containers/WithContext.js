import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';

function withContext(Component, propertyId = 'contextId') {
    function WithContext(props) {
        return <Component {...props} />
    }

    WithContext.propTypes = {
        [propertyId]: PropTypes.string.isRequired
    }

    const mapStateToProps = (state, ownProps) => ({
        context: filterObjects(state.contexts).find(context => context.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithContext);
}

export default withContext;