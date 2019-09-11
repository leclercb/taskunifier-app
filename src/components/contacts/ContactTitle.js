import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleContact } from 'selectors/ContactSelectors';
import { getContactTitle } from 'utils/ContactUtils';

export function ContactTitle(props) {
    const contact = useSelector(state => getVisibleContact(state, props.contactId));
    return contact ? <Icon icon="circle" color={contact.color} text={getContactTitle(contact)} /> : <span>&nbsp;</span>;
}

ContactTitle.propTypes = {
    contactId: PropTypes.string
};

export default ContactTitle;