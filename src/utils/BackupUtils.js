import { getPathSeparator, join, getDirectories } from "./ActionUtils";

export const getBackupDate = directory => {
    return Number(directory.substr(directory.lastIndexOf(getPathSeparator()) + 1));
}

export const getBackups = getState => {
    const path = join(getState().settings.dataFolder, 'backups');
    return getDirectories(path).map(directory => getBackupDate(directory));
};