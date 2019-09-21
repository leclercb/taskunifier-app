import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from 'actions/SettingActions';
import { getSettings } from 'selectors/SettingSelectors';

export function useSettingsApi() {
    const dispatch = useDispatch();
    const settings = useSelector(getSettings);

    const updateSettingsCallback = useCallback(
        (settings, options) => dispatch(updateSettings(settings, options)),
        [dispatch]
    );

    return {
        dispatch,
        settings,
        updateSettings: updateSettingsCallback
    };
}