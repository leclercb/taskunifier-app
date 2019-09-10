import React from 'react';
import { Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import Spacer from 'components/common/Spacer';
import ObjectMenu from 'components/sider/ObjectMenu';
import Constants from 'constants/Constants';
import 'components/sider/ObjectMenuItem.css';

function ObjectMenuItem({ badge, object, onManage, onEdit, onDelete, dropType, onDrop }) {
    const [collectedDropProps, drop] = useDrop({
        accept: dropType || [],
        drop: item => onDrop ? onDrop(item.data.object, object) : null,
        collect: monitor => ({
            highlighted: monitor.canDrop(),
            hovered: monitor.isOver()
        })
    });

    const createEditDeleteButtons = (object, onEdit, onDelete) => {
        return (
            <React.Fragment>
                <Icon
                    icon="edit"
                    color={Constants.fadeIconColor}
                    className="object-actions"
                    onClick={() => onEdit()} />
                <Spacer />
                <Popconfirm
                    title={`Do you really want to delete "${object.title}" ?`}
                    onConfirm={() => onDelete()}
                    okText="Yes"
                    cancelText="No">
                    <Icon
                        icon="trash-alt"
                        color={Constants.fadeIconColor}
                        className="object-actions" />
                </Popconfirm>
            </React.Fragment>
        );
    };

    const onAction = action => {
        switch (action.type) {
            case 'edit':
                onEdit();
                break;
            case 'manage':
                onManage();
                break;
            default:
                break;
        }
    };

    const className = collectedDropProps.hovered ? 'menu-item-hovered' : collectedDropProps.highlighted ? 'menu-item-highlighted' : '';

    return (
        <ObjectMenu onAction={onAction}>
            <div ref={drop}>
                <LeftRight
                    right={(
                        <React.Fragment>
                            {createEditDeleteButtons(object, onEdit, onDelete)}
                            {badge}
                        </React.Fragment>
                    )}
                    className={className}>
                    <Icon icon="circle" color={object.color} text={object.title} />
                </LeftRight>
            </div>
        </ObjectMenu>
    );
}

ObjectMenuItem.propTypes = {
    badge: PropTypes.node,
    object: PropTypes.object.isRequired,
    onManage: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    dropType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string.isRequired)
    ]),
    onDrop: PropTypes.func
};

export default ObjectMenuItem;