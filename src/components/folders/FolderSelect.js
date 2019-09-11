import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getFoldersFilteredByVisibleState } from 'selectors/FolderSelectors';

export const FolderSelect = React.forwardRef(function FolderSelect(props, ref) {
    const folders = useSelector(getFoldersFilteredByVisibleState);
    const value = folders.find(folder => folder.id === props.value) ? props.value : null;

    return (
        <Select ref={ref} allowClear={true} {...props} value={value}>
            {folders.map(folder => (
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