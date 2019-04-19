import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import Icon from '../components/common/Icon';
import Constants from '../constants/Constants';
import Spacer from '../components/common/Spacer';

export const createAction = (icon, text, onClick, color) => (
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

export const createActions = (item, onDuplicate, onDelete) => (
    <React.Fragment>
        {createAction('copy', `Duplicate "${item.title}" ?`, onDuplicate)}
        <Spacer />
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