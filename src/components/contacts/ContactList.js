import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import { createActions } from 'utils/CategoryListUtils';
import { getContactTitle } from 'utils/ContactUtils';

function ContactList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.contacts}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onContactSelection(item)}
                        className={item.id === props.selectedContactId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(
                            item,
                            () => props.duplicateContact(item),
                            () => props.deleteContact(item.id),
                            item => getContactTitle(item))}>
                            <Icon icon="circle" color={item.color} text={getContactTitle(item)} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addContact()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

ContactList.propTypes = {
    contacts: PropTypes.array.isRequired,
    selectedContactId: PropTypes.string,
    addContact: PropTypes.func.isRequired,
    duplicateContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired,
    onContactSelection: PropTypes.func.isRequired
};

export default ContactList;