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
                color={color ? color : Constants.lightColor}
                text={text} />
        )}>
            <span>
                <Icon
                    icon={icon}
                    color={color ? color : Constants.fadeColor}
                    className={color ? '' : 'object-actions'}
                    onClick={onClick} />
            </span>
        </Tooltip>
    );
}

export function createActions(item, onDuplicate, onDelete) {
    return (
        <React.Fragment>
            {onDuplicate ? createAction('copy', `Duplicate "${item.title}" ?`, onDuplicate) : null}
            <Spacer />
            {onDelete ? (
                <Popconfirm
                    title={(
                        <Icon
                            icon="trash-alt"
                            color={Constants.color}
                            text={`Do you really want to delete "${item.title}" ?`} />
                    )}
                    placement="right"
                    onConfirm={() => onDelete(item.id)}
                    okText="Yes"
                    cancelText="No">
                    {createAction('trash-alt', `Delete "${item.title}" ?`)}
                </Popconfirm>
            ) : null}
        </React.Fragment>
    );
}