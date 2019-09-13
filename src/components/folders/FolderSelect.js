import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useFolderApi } from 'hooks/UseFolderApi';

export const FolderSelect = React.forwardRef(function FolderSelect(props, ref) {
    const folderApi = useFolderApi();
    const value = folderApi.folders.find(folder => folder.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {folderApi.folders.map(folder => (
                <Select.Option key={folder.id} value={folder.id}>
                    <Icon icon="circle" color={folder.color} text={folder.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

FolderSelect.displayName = 'ForwardRefFolderSelect';

FolderSelect.propTypes = {
    value: PropTypes.string
};

export default FolderSelect;