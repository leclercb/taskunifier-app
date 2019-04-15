import { getPathSeparator, getUserDataPath, join, getDirectories, createDirectory } from "./ActionUtils";

export const getBackupDate = directory => {
    return Number(directory.substr(directory.lastIndexOf(getPathSeparator()) + 1));
}

export const getBackups = () => {
    createDirectory(join(getUserDataPath(), 'backups'));
    return getDirectories(join(getUserDataPath(), 'backups')).map(directory => getBackupDate(directory));
};