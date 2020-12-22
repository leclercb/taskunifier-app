import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Menu, Popover } from 'antd';
import PropTypes from 'prop-types';
import 'components/common/conditiontree/AddButton.css';

function AddButton(props) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [filter, setFilter] = useState('');

    const onMenuClick = event => {
        onMenuVisibleChange(false);
        props.onClick(event.key);
    };

    const onMenuVisibleChange = visible => {
        setMenuVisible(visible);
    };

    return (
        <Popover
            content={(
                <React.Fragment>
                    <Input.Search
                        placeholder="Search..."
                        allowClear={true}
                        defaultValue={filter}
                        onChange={event => setFilter(event.target.value)} />
                    <Menu
                        onClick={onMenuClick}
                        style={{ width: 240 }}
                        mode="vertical"
                        theme="light">
                        <Menu.SubMenu key="conditionGroup" title="Condition Group">
                            <Menu.Item key="conditionGroupAnd">AND</Menu.Item>
                            <Menu.Item key="conditionGroupOr">OR</Menu.Item>
                            <Menu.Item key="conditionGroupNot">NOT</Menu.Item>
                        </Menu.SubMenu>
                        {typeof props.menuItems === 'function' ? props.menuItems(filter) : props.menuItems}
                    </Menu>
                </React.Fragment>
            )}
            title="Add Condition"
            placement="bottom"
            trigger="click"
            visible={menuVisible}
            onVisibleChange={onMenuVisibleChange}
            overlayClassName="condition-tree-add-menu">
            <Button
                disabled={props.disabled === true}
                shape="circle"
                icon={(<PlusOutlined />)}
                size="small" />
        </Popover>
    );
}

AddButton.propTypes = {
    menuItems: PropTypes.oneOfType([PropTypes.node.isRequired, PropTypes.func.isRequired]).isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};

export default AddButton;