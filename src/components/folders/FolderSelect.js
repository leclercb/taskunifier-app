import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { FolderPropType } from '../../proptypes/FolderPropTypes';
import withFolders from '../../containers/WithFolders';
import Icon from '../common/Icon';

function FolderSelect(props) {
    const { folders, ...restProps } = props;

    return (
        <Select allowClear={true} {...restProps}>
            {folders.map(folder => (
                <Select.Option key={folder.id} value={folder.id}>
                    <Icon icon="circle" color={folder.color} text={folder.title} />
                </Select.Option>
            ))}
        </Select>
    );
}

FolderSelect.propTypes = {
    folders: PropTypes.arrayOf(FolderPropType).isRequired
}

export default withFolders(FolderSelect);