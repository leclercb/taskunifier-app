import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import Icon from '../components/common/Icon';
import Constants from '../constants/Constants';

export const createAction = (icon, text, onClick) => (
    <Tooltip title={(
        <Icon
            icon={icon}
            color={Constants.lightColor}
            text={text} />
    )}>
        <span>
            <Icon
                icon={icon}
                color={Constants.fadeColor}
                className="object-actions"
                onClick={onClick} />
        </span>
    </Tooltip>
);

export const createActions = (item, onDuplicate, onDelete) => (
    <React.Fragment>
        {createAction('copy', `Duplicate "${item.title}" ?`, onDuplicate)}
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
    </React.Fragment>
);