import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { ContactPropType } from 'proptypes/ContactPropTypes';
import withContacts from 'containers/WithContacts';
import Icon from 'components/common/Icon';
import { getContactTitle } from 'utils/ContactUtils';

export const ContactSelect = React.forwardRef(function ContactSelect(props, ref) {
    const { contacts, ...restProps } = props;

    restProps.value = contacts.find(contact => contact.id === restProps.value) ? restProps.value : null;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {contacts.map(contact => (
                <Select.Option key={contact.id} value={contact.id}>
                    <Icon icon="circle" color={contact.color} text={getContactTitle(contact)} />
                </Select.Option>
            ))}
        </Select>
    );
});

ContactSelect.propTypes = {
    contacts: PropTypes.arrayOf(ContactPropType.isRequired).isRequired
};

export default withContacts(ContactSelect);