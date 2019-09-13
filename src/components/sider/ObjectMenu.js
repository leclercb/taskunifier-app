import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';

function ObjectMenu({ onAction, children }) {
    const [visible, setVisible] = useState(false);

    const onClick = ({ item }) => {
        if (item.props.action) {
            onAction(item.props.action);
        }

        setVisible(false);
    };

    const menu = (
        <Menu
            onClick={onClick}
            style={{ width: 250 }}>
            <Menu.Item key="edit" action={{ type: 'edit' }}>
                <Icon icon="edit" text="Edit" />
            </Menu.Item>
            <Menu.Item key="manage" action={{ type: 'manage' }}>
                <Icon icon="cubes" text="Manage" />
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

ObjectMenu.propTypes = {
    onAction: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default ObjectMenu;