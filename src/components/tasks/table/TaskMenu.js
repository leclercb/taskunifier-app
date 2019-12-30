import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';

function TaskMenu({ selectedTaskIds, onAction, children }) {
    const [visible, setVisible] = useState(false);

    const onClick = ({ item }) => {
        if (item.props.action) {
            onAction(item.props.action);
        }

        setVisible(false);
    };

    const createPostponeMenu = (key, title) => (
        <Menu.SubMenu
            key={key}
            title={(<Icon icon="calendar-alt" text={title} />)}>
            <Menu.Item key={`${key}_1d`} action={{ type: key, amount: 1, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 1 day" />
            </Menu.Item>
            <Menu.Item key={`${key}_2d`} action={{ type: key, amount: 2, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 2 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_3d`} action={{ type: key, amount: 3, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 3 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_4d`} action={{ type: key, amount: 4, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 4 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_5d`} action={{ type: key, amount: 5, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 5 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_6d`} action={{ type: key, amount: 6, unit: 'day' }}>
                <Icon icon="calendar-alt" text="Add 6 days" />
            </Menu.Item>
            <Menu.Item key={`${key}_1w`} action={{ type: key, amount: 1, unit: 'week' }}>
                <Icon icon="calendar-alt" text="Add 1 week" />
            </Menu.Item>
            <Menu.Item key={`${key}_2w`} action={{ type: key, amount: 2, unit: 'week' }}>
                <Icon icon="calendar-alt" text="Add 2 weeks" />
            </Menu.Item>
            <Menu.Item key={`${key}_3w`} action={{ type: key, amount: 3, unit: 'week' }}>
                <Icon icon="calendar-alt" text="Add 3 weeks" />
            </Menu.Item>
            <Menu.Item key={`${key}_1m`} action={{ type: key, amount: 1, unit: 'month' }}>
                <Icon icon="calendar-alt" text="Add 1 month" />
            </Menu.Item>
            <Menu.Item key={`${key}_2m`} action={{ type: key, amount: 2, unit: 'month' }}>
                <Icon icon="calendar-alt" text="Add 2 months" />
            </Menu.Item>
        </Menu.SubMenu>
    );

    const suffix = `${selectedTaskIds.length} task${selectedTaskIds.length > 1 ? 's' : ''}`;

    const menu = (
        <Menu
            onClick={onClick}
            style={{ width: 300 }}>
            {selectedTaskIds.length > 1 ?
                (
                    <Menu.Item key="batchEdit" action={{ type: 'batchEdit' }}>
                        <Icon icon="magic" text={`Batch edit ${suffix}`} />
                    </Menu.Item>
                ) :
                (
                    <Menu.Item key="edit" action={{ type: 'edit' }}>
                        <Icon icon="edit" text={`Edit ${suffix}`} />
                    </Menu.Item>
                )
            }
            <Menu.Item key="moveOutOfParentTask" action={{ type: 'moveOutOfParentTask' }}>
                <Icon icon="trash-alt" text="Move out of parent task" />
            </Menu.Item>
            <Menu.Item key="duplicate" action={{ type: 'duplicate' }}>
                <Icon icon="copy" text={`Duplicate ${suffix}`} />
            </Menu.Item>
            <Menu.Divider />
            {createPostponeMenu('postponeStartDate', `Postpone start date of ${suffix}`)}
            {createPostponeMenu('postponeDueDate', `Postpone due date of ${suffix}`)}
            <Menu.Divider />
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

TaskMenu.propTypes = {
    selectedTaskIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onAction: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default TaskMenu;