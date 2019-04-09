import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Popover } from 'antd';

function AddButton(props) {
    const [menuVisible, setMenuVisible] = useState(false);

    const onMenuClick = event => {
        handleMenuVisibleChange(false);
        props.onClick(event.key);
    }

    const handleMenuVisibleChange = visible => {
        setMenuVisible(visible);
    }

    return (
        <Popover
            content={
                <Menu onClick={onMenuClick} style={{ width: 240 }} mode="vertical" theme="light">
                    <Menu.SubMenu key="condition_group" title='Condition Group'>
                        <Menu.Item key="condition_group_and">AND</Menu.Item>
                        <Menu.Item key="condition_group_or">OR</Menu.Item>
                        <Menu.Item key="condition_group_not">NOT</Menu.Item>
                    </Menu.SubMenu>
                    {props.children}
                </Menu>
            }
            title="Add Condition"
            trigger="click"
            visible={menuVisible}
            onVisibleChange={handleMenuVisibleChange}>
            <Button
                shape="circle"
                icon="plus"
                size="small" />
        </Popover>
    );
}

AddButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default AddButton;