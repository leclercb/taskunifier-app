import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import Constants from 'constants/Constants';
import Spacer from 'components/common/Spacer';

export function createAction(icon, text, onClick, color) {
    return (
        <Tooltip title={(
            <Icon
                icon={icon}
                color={color ? color : Constants.lightIconColor}
                text={text} />
        )}>
            <span>
                <Icon
                    icon={icon}
                    color={color ? color : Constants.fadeIconColor}
                    className={color ? '' : 'object-actions'}
                    onClick={onClick} />
            </span>
        </Tooltip>
    );
}

export function createActions(item, onDuplicate, onDelete, getTitle = item => item.title) {
    return (
        <React.Fragment>
            {onDuplicate ? createAction('copy', `Duplicate "${getTitle(item)}" ?`, onDuplicate) : null}
            <Spacer />
            {onDelete ? (
                <Popconfirm
                    title={(
                        <Icon
                            icon="trash-alt"
                            color={Constants.color}
                            text={`Do you really want to delete "${getTitle(item)}" ?`} />
                    )}
                    placement="right"
                    onConfirm={() => onDelete(item.id)}
                    okText="Yes"
                    cancelText="No">
                    {createAction('trash-alt', `Delete "${getTitle(item)}" ?`)}
                </Popconfirm>
            ) : null}
        </React.Fragment>
    );
}