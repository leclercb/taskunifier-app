import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';

function withGoal(Component, propertyId = 'goalId') {
    function WithGoal(props) {
        return <Component {...props} />
    }

    WithGoal.propTypes = {
        [propertyId]: PropTypes.string
    }

    const mapStateToProps = (state, ownProps) => ({
        goal: filterObjects(state.goals).find(goal => goal.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithGoal);
}

export default withGoal;