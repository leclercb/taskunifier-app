import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { FolderPropType } from 'proptypes/FolderPropTypes';
import withFolders from 'containers/WithFolders';
import Icon from 'components/common/Icon';

export const FolderSelect = React.forwardRef(function FolderSelect(props, ref) {
    const { folders, ...restProps } = props;

    restProps.value = props.folders.find(folder => folder.id === restProps.value) ? restProps.value : null;

    return (
        <Select ref={ref} allowClear={true} {...restProps}>
            {folders.map(folder => (
                <Select.Option key={folder.id} value={folder.id}>
                    <Icon icon="circle" color={folder.color} text={folder.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

FolderSelect.propTypes = {
    folders: PropTypes.arrayOf(FolderPropType.isRequired).isRequired
};

export default withFolders(FolderSelect, { filterArchived: true });