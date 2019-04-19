import React from 'react';
import PropTypes from 'prop-types';
import { ContactPropType } from '../../proptypes/ContactPropTypes';
import withContact from '../../containers/WithContact';
import Icon from '../common/Icon';
import { getContactTitle } from '../../utils/ContactUtils';

export function ContactTitle(props) {
    const contact = props.contact;
    return contact ? <Icon icon="circle" color={contact.color} text={getContactTitle(contact)} /> : <span>&nbsp;</span>;
}

ContactTitle.propTypes = {
    contactId: PropTypes.string,
    contact: ContactPropType
}

export default withContact(ContactTitle);