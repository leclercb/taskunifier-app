import { getSettings } from 'selectors/SettingSelectors';
import { getDirectories, getPathSeparator, join } from 'utils/ActionUtils';

export function getBackupDate(directory) {
    return Number(directory.substr(directory.lastIndexOf(getPathSeparator()) + 1));
}

export function getBackups(state) {
    const path = join(getSettings(state).dataFolder, 'backups');
    const backups = getDirectories(path).map(directory => getBackupDate(directory));
    return backups.sort((a, b) => Number(a) - Number(b));
}