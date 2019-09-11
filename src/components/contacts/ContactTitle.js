import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useContact } from 'hooks/UseContact';
import { getContactTitle } from 'utils/ContactUtils';

export function ContactTitle(props) {
    const contact = useContact(props.contactId);
    return contact ? <Icon icon="circle" color={contact.color} text={getContactTitle(contact)} /> : <span>&nbsp;</span>;
}

ContactTitle.propTypes = {
    contactId: PropTypes.string
};

export default ContactTitle;