import React from 'react';
import PropTypes from 'prop-types';
import { FolderPropType } from '../../proptypes/FolderPropTypes';
import withFolder from '../../containers/WithFolder';
import Icon from '../common/Icon';

export function FolderTitle(props) {
    const folder = props.folder;
    return folder ? <Icon icon="circle" color={folder.color} text={folder.title} /> : <span>&nbsp;</span>;
}

FolderTitle.propTypes = {
    folderId: PropTypes.string,
    folder: FolderPropType
};

export default withFolder(FolderTitle);