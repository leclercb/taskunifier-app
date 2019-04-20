import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { ContactPropType } from '../../proptypes/ContactPropTypes';
import withContacts from '../../containers/WithContacts';
import Icon from '../common/Icon';
import { getContactTitle } from '../../utils/ContactUtils';

export const ContactSelect = React.forwardRef((props, ref) => {
    const { contacts, ...restProps } = props;

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
    contacts: PropTypes.arrayOf(ContactPropType).isRequired
}

export default withContacts(ContactSelect);