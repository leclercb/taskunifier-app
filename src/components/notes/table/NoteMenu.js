import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';

function NoteMenu({ selectedNoteIds, onAction, children }) {
    const [visible, setVisible] = useState(false);

    const onClick = ({ item }) => {
        if (item.props.action) {
            onAction(item.props.action);
        }

        setVisible(false);
    };

    const suffix = `${selectedNoteIds.length} note${selectedNoteIds.length > 1 ? 's' : ''}`;

    const menu = (
        <Menu
            onClick={onClick}
            style={{ width: 300 }}>
            <Menu.Item key="duplicate" action={{ type: 'duplicate' }}>
                <Icon icon="copy" text={`Duplicate ${suffix}`} />
            </Menu.Item>
            <Menu.Item key="remove" action={{ type: 'remove' }}>
                <Icon icon="trash-alt" text={`Remove ${suffix}`} />
            </Menu.Item>
        </Menu>

    );

    return (
        <Dropdown
            overlay={menu}
            trigger={['contextMenu']}
            visible={visible}
            onVisibleChange={setVisible}>
            {children}
        </Dropdown>
    );
}

NoteMenu.propTypes = {
    selectedNoteIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onAction: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default NoteMenu;