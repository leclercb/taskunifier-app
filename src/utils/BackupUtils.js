import { getDirectories, getPathSeparator, join } from 'utils/ActionUtils';

export const getBackupDate = directory => {
    return Number(directory.substr(directory.lastIndexOf(getPathSeparator()) + 1));
};

export const getBackups = state => {
    const path = join(state.settings.dataFolder, 'backups');
    const backups = getDirectories(path).map(directory => getBackupDate(directory));
    return backups.sort((a, b) => Number(a) - Number(b));
};