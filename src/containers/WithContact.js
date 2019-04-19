import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterObjects } from '../utils/CategoryUtils';

function withContact(Component, propertyId = 'contactId') {
    function WithContact(props) {
        return <Component {...props} />
    }

    WithContact.propTypes = {
        [propertyId]: PropTypes.string
    }

    const mapStateToProps = (state, ownProps) => ({
        contact: filterObjects(state.contacts).find(contact => contact.id === ownProps[propertyId])
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithContact);
}

export default withContact;