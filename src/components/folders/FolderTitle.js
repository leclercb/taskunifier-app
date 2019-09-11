import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useFolder } from 'hooks/UseFolder';

export function FolderTitle(props) {
    const folder = useFolder(props.folderId);
    return folder ? <Icon icon="circle" color={folder.color} text={folder.title} /> : <span>&nbsp;</span>;
}

FolderTitle.propTypes = {
    folderId: PropTypes.string
};

export default FolderTitle;