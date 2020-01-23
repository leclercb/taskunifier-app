import {
    getCalendarDateMode,
    getCategoryNoteSorters,
    getCategoryTaskSorters,
    getCombinedNoteFilterDefinitions,
    getCombinedTaskFilterDefinitions,
    getSelectedCalendarView,
    getSelectedView,
    getSettings,
    getSettingsSelector,
    isShowCompletedTasks,
    isShowFutureTasks,
    isShowTaskHierarchy
} from 'selectors/SettingSelectors';
import { clone } from 'utils/ObjectUtils';

const state = {
    settings: {
        a: 'A',
        b: 'B',
        c: 'C',
        d: 4,
        e: { test: 'TEST' },
        f: false,
        g: true,
        selectedView: 'task',
        selectedCalendarView: 'agenda',
        showTaskHierarchy: false,
        showCompletedTasks: true,
        showFutureTasks: false,
        calendarDateMode: 'dueDate',
        combinedNoteFilterDefinitions: [],
        combinedTaskFilterDefinitions: [],
        categoryNoteSorters: [],
        categoryTaskSorters: []
    }
};

describe('getSettings', () => {
    expect(getSettings(state)).toBe(state.settings);
});

describe('getSettingsSelector', () => {
    test('update other property', () => {
        let s = clone(state);
        const selector = getSettingsSelector();

        const result1 = selector(s, /^selectedView$/);
        s = { ...s, a: 'A2' };
        const result2 = selector(s, /^selectedView$/);

        expect(result1).toBe(result2);
        expect(result2).toEqual({ selectedView: 'task' });
    });

    test('update other properties', () => {
        let s = clone(state);
        const selector = getSettingsSelector();

        const result1 = selector(s, /^(selectedView|(category.*Sorters))$/);
        s = { ...s, a: 'A2' };
        const result2 = selector(s, /^(selectedView|(category.*Sorters))$/);

        expect(result1).toBe(result2);
        expect(result2).toEqual({ selectedView: 'task', categoryNoteSorters: [], categoryTaskSorters: [] });
    });

    test('update requested property', () => {
        let s = clone(state);
        const selector = getSettingsSelector();

        const result1 = selector(s, /^selectedView$/);
        s = { settings: { ...s.settings, selectedView: 'test' } };
        const result2 = selector(s, /^selectedView$/);

        expect(result1).not.toBe(result2);
        expect(result2).toEqual({ selectedView: 'test' });
    });

    test('update requested properties', () => {
        let s = clone(state);
        const selector = getSettingsSelector();

        const result1 = selector(s, /^(selectedView|(category.*Sorters))$/);
        s = { settings: { ...s.settings, selectedView: 'test' } };
        const result2 = selector(s, /^(selectedView|(category.*Sorters))$/);

        expect(result1).not.toBe(result2);
        expect(result2).toEqual({ selectedView: 'test', categoryNoteSorters: [], categoryTaskSorters: [] });
    });
});

describe('getSelectedView', () => {
    expect(getSelectedView(state)).toBe(state.settings.selectedView);
});

describe('getSelectedCalendarView', () => {
    expect(getSelectedCalendarView(state)).toBe(state.settings.selectedCalendarView);
});

describe('isShowTaskHierarchy', () => {
    expect(isShowTaskHierarchy(state)).toBe(state.settings.showTaskHierarchy);
});

describe('isShowCompletedTasks', () => {
    expect(isShowCompletedTasks(state)).toBe(state.settings.showCompletedTasks);
});

describe('isShowFutureTasks', () => {
    expect(isShowFutureTasks(state)).toBe(state.settings.showFutureTasks);
});

describe('getCalendarDateMode', () => {
    expect(getCalendarDateMode(state)).toBe(state.settings.calendarDateMode);
});

describe('getCombinedNoteFilterDefinitions', () => {
    expect(getCombinedNoteFilterDefinitions(state)).toBe(state.settings.combinedNoteFilterDefinitions);
});

describe('getCombinedTaskFilterDefinitions', () => {
    expect(getCombinedTaskFilterDefinitions(state)).toBe(state.settings.combinedTaskFilterDefinitions);
});

describe('getCategoryNoteSorters', () => {
    expect(getCategoryNoteSorters(state)).toBe(state.settings.categoryNoteSorters);
});

describe('getCategoryTaskSorters', () => {
    expect(getCategoryTaskSorters(state)).toBe(state.settings.categoryTaskSorters);
});