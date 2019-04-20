import React from 'react';
import { connect } from 'react-redux';
import { addField, updateField, deleteField } from '../actions/FieldActions';
import { getDefaultFields } from '../data/DataFields';
import { filterObjects } from '../utils/CategoryUtils';

function withFields(Component) {
    function WithFields(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        fields: getDefaultFields(state.settings).concat(filterObjects(state.fields))
    });

    const mapDispatchToProps = dispatch => ({
        addField: field => dispatch(addField(field)),
        updateField: field => dispatch(updateField(field)),
        deleteField: fieldId => dispatch(deleteField(fieldId))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithFields);
}

export default withFields;