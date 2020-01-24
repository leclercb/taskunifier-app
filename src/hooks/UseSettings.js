import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getSettingsSelector } from 'selectors/SettingSelectors';

export function useSettings(pattern) {
    const getSettings = useMemo(getSettingsSelector, []);
    const settings = useSelector(state => getSettings(state, pattern));
    return settings;
}