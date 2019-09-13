import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getContactTitle } from 'utils/ContactUtils';
import { useContactApi } from 'hooks/UseContactApi';

export const ContactSelect = React.forwardRef(function ContactSelect(props, ref) {
    const contactApi = useContactApi();
    const value = contactApi.contacts.find(contact => contact.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {contactApi.contacts.map(contact => (
                <Select.Option key={contact.id} value={contact.id}>
                    <Icon icon="circle" color={contact.color} text={getContactTitle(contact)} />
                </Select.Option>
            ))}
        </Select>
    );
});

ContactSelect.displayName = 'ForwardRefContactSelect';

ContactSelect.propTypes = {
    value: PropTypes.string
};

export default ContactSelect;