import { createSelector } from 'reselect';
import { getGeneralNoteFilters } from 'data/DataNoteFilters';
import { getSettingValues } from 'data/DataSettings';
import { getGeneralTaskFilters } from 'data/DataTaskFilters';
import { getNoteFieldsIncludingDefaults } from 'selectors/NoteFieldSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getTaskFieldsIncludingDefaults } from 'selectors/TaskFieldSelectors';

export const getSettingsIncludingDefaults = createSelector(
    getSettings,
    getNoteFieldsIncludingDefaults,
    getTaskFieldsIncludingDefaults,
    (settings, noteFields, taskFields) => {
        return {
            ...getSettingValues({
                generalNoteFilters: getGeneralNoteFilters(),
                noteFields,
                generalTaskFilters: getGeneralTaskFilters(),
                taskFields
            }),
            ...settings
        };
    });