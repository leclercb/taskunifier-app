export const getSettings = state => state.settings;

export const getSelectedView = state => state.settings.selectedView;
export const getSelectedCalendarView = state => state.settings.selectedCalendarView;
export const isShowCompletedTasks = state => state.settings.showCompletedTasks;
export const getCalendarDateMode = state => state.settings.calendarDateMode;