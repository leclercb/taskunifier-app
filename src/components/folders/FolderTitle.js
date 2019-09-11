import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'components/common/Icon';
import { getVisibleFolder } from 'selectors/FolderSelectors';

export function FolderTitle(props) {
    const folder = useSelector(getVisibleFolder(props.folderId));
    return folder ? <Icon icon="circle" color={folder.color} text={folder.title} /> : <span>&nbsp;</span>;
}

FolderTitle.propTypes = {
    folderId: PropTypes.string
};

export default FolderTitle;