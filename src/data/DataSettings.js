import { message } from 'antd';
import moment from 'moment';
import { testConnection } from 'actions/ProxyActions';
import { getPriorities } from 'data/DataPriorities';
import { getStatuses } from 'data/DataStatuses';
import { getUserDataPath } from 'utils/ActionUtils';

export function isCoreSetting(settingId) {
    return !!getCategories().find(category => {
        return category.settings.find(setting => {
            return setting.id === settingId && setting.core === true;
        });
    });
}

export function getSettings() {
    const settings = {};

    getCategories().forEach(category => {
        category.settings.forEach(setting => {
            if (setting.type === 'button') {
                return;
            }

            settings[setting.id] = setting.value;
        });
    });

    return settings;
}

export function getCategorySettings(category, options = {}) {
    const { settings } = category;

    const { noteFields, taskFields } = options;

    if (category.type === 'noteField' && noteFields) {
        noteFields.forEach(field => settings.push(category.createSetting(field)));
    }

    if (category.type === 'taskField' && taskFields) {
        taskFields.forEach(field => settings.push(category.createSetting(field)));
    }

    return settings;
}

export function getCategories() {
    return [
        {
            id: 'general',
            title: 'General',
            icon: 'home',
            settings: [
                {
                    id: 'dataFolder',
                    title: 'Data folder location',
                    type: 'text',
                    value: getUserDataPath(),
                    editable: true,
                    core: true
                },
                {
                    id: 'automaticSave',
                    title: 'Enable automatic save',
                    type: 'boolean',
                    value: true,
                    editable: true
                },
                {
                    id: 'automaticSaveInterval',
                    title: 'Save interval in minutes',
                    type: 'number',
                    value: 15,
                    editable: true
                },
                {
                    id: 'lastAutomaticSave',
                    title: 'Last automatic save',
                    type: 'dateTime',
                    value: moment().toJSON(),
                    editable: false
                },
                {
                    id: 'confirmBeforeClosing',
                    title: 'Confirm before closing',
                    type: 'boolean',
                    value: false,
                    editable: true
                }
            ]
        },
        {
            id: 'proxy',
            title: 'Proxy',
            icon: 'network-wired',
            settings: [
                {
                    id: 'proxyEnabled',
                    title: 'Proxy enabled',
                    type: 'boolean',
                    value: false,
                    editable: true
                },
                {
                    id: 'proxyHost',
                    title: 'Proxy host',
                    type: 'text',
                    value: '',
                    editable: true
                },
                {
                    id: 'proxyPort',
                    title: 'Proxy port',
                    type: 'number',
                    value: 0,
                    editable: true
                },
                {
                    id: 'proxyUsername',
                    title: 'Proxy username',
                    type: 'text',
                    value: '',
                    editable: true
                },
                {
                    id: 'proxyPassword',
                    title: 'Proxy password',
                    type: 'password',
                    value: '',
                    editable: true
                },
                {
                    id: 'testConnection',
                    title: 'Test connection',
                    type: 'button',
                    value: (settings, updateSettings) => {
                        testConnection(settings).then(result => {
                            message.success('Connection test succeeded');
                            console.log(result);
                        }).catch(reason => {
                            message.error('Connection test failed');
                            console.log(reason);
                        })
                    },
                    editable: true
                }
            ]
        },
        {
            id: 'date',
            title: 'Date',
            icon: 'calendar-alt',
            settings: [
                {
                    id: 'showStartTime',
                    title: 'Show start time',
                    type: 'boolean',
                    value: false,
                    editable: true
                },
                {
                    id: 'showDueTime',
                    title: 'Show due time',
                    type: 'boolean',
                    value: false,
                    editable: true
                },
                {
                    id: 'dateFormat',
                    title: 'Date format',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: 'DD/MM/YYYY',
                                value: 'DD/MM/YYYY'
                            },
                            {
                                title: 'DD-MM-YYYY',
                                value: 'DD-MM-YYYY'
                            },
                            {
                                title: 'DD.MM.YYYY',
                                value: 'DD.MM.YYYY'
                            },
                            {
                                title: 'MM/DD/YYYY',
                                value: 'MM/DD/YYYY'
                            },
                            {
                                title: 'MM-DD-YYYY',
                                value: 'MM-DD-YYYY'
                            },
                            {
                                title: 'MM.DD.YYYY',
                                value: 'MM.DD.YYYY'
                            },
                            {
                                title: 'YYYY/MM/DD',
                                value: 'YYYY/MM/DD'
                            },
                            {
                                title: 'YYYY-MM-DD',
                                value: 'YYYY-MM-DD'
                            },
                            {
                                title: 'YYYY.MM.DD',
                                value: 'YYYY.MM.DD'
                            }
                        ]
                    },
                    value: 'DD/MM/YYYY',
                    editable: true
                },
                {
                    id: 'timeFormat',
                    title: 'Time format',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: 'HH:mm',
                                value: 'HH:mm'
                            },
                            {
                                title: 'hh:mm a',
                                value: 'hh:mm a'
                            }
                        ]
                    },
                    value: 'HH:mm',
                    editable: true
                }
            ]
        },
        {
            id: 'license',
            title: 'License',
            icon: 'key',
            settings: [
                {
                    id: 'license',
                    title: 'License',
                    type: 'textarea',
                    value: null,
                    editable: true
                }
            ]
        },
        {
            id: 'backup',
            title: 'Backup',
            icon: 'box-open',
            settings: [
                {
                    id: 'automaticBackup',
                    title: 'Enable automatic backup',
                    type: 'boolean',
                    value: true,
                    editable: true
                },
                {
                    id: 'automaticBackup',
                    title: 'Enable automatic backup',
                    type: 'boolean',
                    value: true,
                    editable: true
                },
                {
                    id: 'maxBackups',
                    title: 'Maximum number of backups to keep',
                    type: 'number',
                    value: 100,
                    editable: true
                },
                {
                    id: 'automaticBackupInterval',
                    title: 'Backup interval in minutes',
                    type: 'number',
                    value: 60,
                    editable: true
                },
                {
                    id: 'lastAutomaticBackup',
                    title: 'Last automatic backup',
                    type: 'dateTime',
                    value: moment().toJSON(),
                    editable: false
                }
            ]
        },
        {
            id: 'taskTemplates',
            title: 'Task templates',
            icon: 'tasks',
            settings: [
                {
                    id: 'defaultTaskTemplate',
                    title: 'Default task template',
                    type: 'taskTemplate',
                    value: null,
                    editable: true
                }
            ]
        },
        {
            id: 'noteTable',
            title: 'Note table',
            icon: 'book',
            type: 'noteField',
            settings: [
                {
                    id: 'noteColumnVisible_id',
                    title: 'Show column "ID"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                },
                {
                    id: 'noteColumnVisible_creationDate',
                    title: 'Show column "Creation date"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                },
                {
                    id: 'noteColumnVisible_updateDate',
                    title: 'Show column "Update date"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                }
            ],
            createSetting: field => ({
                id: `noteColumnVisible_${field.id}`,
                title: `Show column "${field.title}"`,
                type: 'boolean',
                value: true,
                editable: true
            })
        },
        {
            id: 'taskTable',
            title: 'Task table',
            icon: 'tasks',
            type: 'taskField',
            settings: [
                {
                    id: 'taskColumnVisible_id',
                    title: 'Show column "ID"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                },
                {
                    id: 'taskColumnVisible_creationDate',
                    title: 'Show column "Creation date"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                },
                {
                    id: 'taskColumnVisible_updateDate',
                    title: 'Show column "Update date"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                }
            ],
            createSetting: field => ({
                id: `taskColumnVisible_${field.id}`,
                title: `Show column "${field.title}"`,
                type: 'boolean',
                value: true,
                editable: true
            })
        },
        {
            id: 'taskFields',
            title: 'Task fields',
            icon: 'tasks',
            type: 'taskField',
            settings: [
                {
                    id: 'taskFieldVisible_id',
                    title: 'Show field "ID"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                },
                {
                    id: 'taskFieldVisible_creationDate',
                    title: 'Show field "Creation date"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                },
                {
                    id: 'taskFieldVisible_updateDate',
                    title: 'Show field "Update date"',
                    type: 'boolean',
                    value: false,
                    editable: false,
                    visible: false
                }
            ],
            createSetting: field => ({
                id: `taskFieldVisible_${field.id}`,
                title: `Show field "${field.title}"`,
                type: 'boolean',
                value: true,
                editable: true
            })
        },
        {
            id: 'colors',
            title: 'Colors',
            icon: 'paint-roller',
            settings: [
                {
                    id: 'showImportanceColor',
                    title: 'Show importance color',
                    type: 'boolean',
                    value: true,
                    editable: true
                },
                {
                    id: 'resetDefaultColors',
                    title: 'Reset default colors',
                    type: 'button',
                    value: (settings, updateSettings) => {
                        updateSettings({
                            evenColor: '#fafafa',
                            oddColor: '#e8f1f7',
                            dueTodayForegroundColor: '#1b5e20',
                            overdueForegroundColor: '#b71c1c'
                        });
                    },
                    editable: true
                },
                {
                    id: 'evenColor',
                    title: 'Even color',
                    type: 'color',
                    value: '#fafafa',
                    editable: true
                },
                {
                    id: 'oddColor',
                    title: 'Odd color',
                    type: 'color',
                    value: '#e8f1f7',
                    editable: true
                },
                {
                    id: 'dueTodayForegroundColor',
                    title: 'Due today foreground color',
                    type: 'color',
                    value: '#1b5e20',
                    editable: true
                },
                {
                    id: 'overdueForegroundColor',
                    title: 'Overdue foreground color',
                    type: 'color',
                    value: '#b71c1c',
                    editable: true
                }
            ]
        },
        {
            id: 'importanceColors',
            title: 'Importance colors',
            icon: 'paint-roller',
            settings: [
                {
                    id: 'resetPastelColors',
                    title: 'Reset pastel colors',
                    type: 'button',
                    value: (settings, updateSettings) => {
                        updateSettings({
                            importance_0: '#fafafa',
                            importance_1: '#fafafa',
                            importance_2: '#eceff1',
                            importance_3: '#eaf5fc',
                            importance_4: '#e3f2fd',
                            importance_5: '#f1f8e9',
                            importance_6: '#e8f5e9',
                            importance_7: '#fffde7',
                            importance_8: '#fff8e1',
                            importance_9: '#fff3e0',
                            importance_10: '#fcebd4',
                            importance_11: '#fbe9e7',
                            importance_12: '#fce4ec'
                        });
                    },
                    editable: true
                },
                {
                    id: 'resetBrightColors',
                    title: 'Reset bright colors',
                    type: 'button',
                    value: (settings, updateSettings) => {
                        updateSettings({
                            importance_0: '#fafafa',
                            importance_1: '#fafafa',
                            importance_2: '#eceff1',
                            importance_3: '#e1f5fe',
                            importance_4: '#b3e5fc',
                            importance_5: '#dcedc8',
                            importance_6: '#c5e1a5',
                            importance_7: '#fff9c4',
                            importance_8: '#fff176',
                            importance_9: '#ffe082',
                            importance_10: '#ffd54f',
                            importance_11: '#fcbfbf',
                            importance_12: '#ffab91'
                        });
                    },
                    editable: true
                },
                {
                    id: 'importance_0',
                    title: 'Importance 0',
                    type: 'color',
                    value: '#fafafa',
                    editable: true
                },
                {
                    id: 'importance_1',
                    title: 'Importance 1',
                    type: 'color',
                    value: '#fafafa',
                    editable: true
                },
                {
                    id: 'importance_2',
                    title: 'Importance 2',
                    type: 'color',
                    value: '#eceff1',
                    editable: true
                },
                {
                    id: 'importance_3',
                    title: 'Importance 3',
                    type: 'color',
                    value: '#eaf5fc',
                    editable: true
                },
                {
                    id: 'importance_4',
                    title: 'Importance 4',
                    type: 'color',
                    value: '#e3f2fd',
                    editable: true
                },
                {
                    id: 'importance_5',
                    title: 'Importance 5',
                    type: 'color',
                    value: '#f1f8e9',
                    editable: true
                },
                {
                    id: 'importance_6',
                    title: 'Importance 6',
                    type: 'color',
                    value: '#e8f5e9',
                    editable: true
                },
                {
                    id: 'importance_7',
                    title: 'Importance 7',
                    type: 'color',
                    value: '#fffde7',
                    editable: true
                },
                {
                    id: 'importance_8',
                    title: 'Importance 8',
                    type: 'color',
                    value: '#fff8e1',
                    editable: true
                },
                {
                    id: 'importance_9',
                    title: 'Importance 9',
                    type: 'color',
                    value: '#fff3e0',
                    editable: true
                },
                {
                    id: 'importance_10',
                    title: 'Importance 10',
                    type: 'color',
                    value: '#fcebd4',
                    editable: true
                },
                {
                    id: 'importance_11',
                    title: 'Importance 11',
                    type: 'color',
                    value: '#fbe9e7',
                    editable: true
                },
                {
                    id: 'importance_12',
                    title: 'Importance 12',
                    type: 'color',
                    value: '#fce4ec',
                    editable: true
                }
            ]
        },
        {
            id: 'priorityColors',
            title: 'Priority colors',
            icon: 'paint-roller',
            settings: getPriorities().map(priority => ({
                id: 'priority_' + priority.id,
                title: 'Priority ' + priority.title,
                type: 'color',
                value: priority.color,
                editable: true
            }))
        },
        {
            id: 'statusColors',
            title: 'Status colors',
            icon: 'paint-roller',
            settings: getStatuses().map(status => ({
                id: 'status_' + status.id,
                title: 'Status ' + status.title,
                type: 'color',
                value: status.color,
                editable: true
            }))
        },
        {
            id: 'window',
            title: 'Window',
            icon: 'desktop',
            settings: [
                {
                    id: 'selectedView',
                    title: 'Selected view',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: 'Calendar',
                                value: 'taskCalendar'
                            },
                            {
                                title: 'Notes',
                                value: 'note'
                            },
                            {
                                title: 'Tasks',
                                value: 'task'
                            }
                        ]
                    },
                    value: 'task',
                    editable: false,
                    visible: false
                },
                {
                    id: 'selectedCalendarView',
                    title: 'Selected calendar view',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: 'Agenda',
                                value: 'agenda'
                            },
                            {
                                title: 'Day',
                                value: 'day'
                            },
                            {
                                title: 'Month',
                                value: 'month'
                            },
                            {
                                title: 'Week',
                                value: 'week'
                            },
                            {
                                title: 'Work week',
                                value: 'work_week'
                            }
                        ]
                    },
                    value: 'month',
                    editable: false,
                    visible: false
                },
                {
                    id: 'showCompletedTasks',
                    title: 'Show completed tasks',
                    type: 'boolean',
                    value: true,
                    editable: false,
                    visible: false
                },
                {
                    id: 'calendarDateMode',
                    title: 'Calendar date mode',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: 'Both',
                                value: 'both'
                            },
                            {
                                title: 'Due date',
                                value: 'dueDate'
                            },
                            {
                                title: 'Start date',
                                value: 'startDate'
                            }
                        ]
                    },
                    value: 'both',
                    editable: false,
                    visible: false
                },
                {
                    id: 'windowSizeWidth',
                    title: 'Window size - Width',
                    type: 'number',
                    value: 1024,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowSizeHeight',
                    title: 'Window size - Height',
                    type: 'number',
                    value: 768,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowPositionX',
                    title: 'Window position - X',
                    type: 'number',
                    value: null,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowPositionY',
                    title: 'Window position - Y',
                    type: 'number',
                    value: null,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'noteViewSplitPaneSize',
                    title: 'Note view split pane size',
                    type: 'number',
                    value: 300,
                    editable: false,
                    visible: false
                },
                {
                    id: 'noteViewSubSplitPaneSize',
                    title: 'Note view split pane size',
                    type: 'number',
                    value: 300,
                    editable: false,
                    visible: false
                },
                {
                    id: 'noteViewSubSplitPaneMode',
                    title: 'Note view split pane mode',
                    type: 'select',
                    value: 'horizontal',
                    editable: true,
                    options: {
                        values: [
                            {
                                title: 'Horizontal',
                                value: 'horizontal'
                            },
                            {
                                title: 'Vertical',
                                value: 'vertical'
                            }
                        ]
                    }
                },
                {
                    id: 'taskViewSplitPaneSize',
                    title: 'Task view split pane size',
                    type: 'number',
                    value: 300,
                    editable: false,
                    visible: false
                },
                {
                    id: 'taskViewSubSplitPaneSize',
                    title: 'Task view split pane size',
                    type: 'number',
                    value: 300,
                    editable: false,
                    visible: false
                },
                {
                    id: 'taskViewSubSplitPaneMode',
                    title: 'Task view split pane mode',
                    type: 'select',
                    value: 'horizontal',
                    editable: true,
                    options: {
                        values: [
                            {
                                title: 'Horizontal',
                                value: 'horizontal'
                            },
                            {
                                title: 'Vertical',
                                value: 'vertical'
                            }
                        ]
                    }
                },
                {
                    id: 'taskCalendarViewSplitPaneSize',
                    title: 'Task calendar view split pane size',
                    type: 'number',
                    value: 300,
                    editable: false,
                    visible: false
                },
                {
                    id: 'taskCalendarViewSubSplitPaneSize',
                    title: 'Task calendar view split pane size',
                    type: 'number',
                    value: 300,
                    editable: false,
                    visible: false
                },
                {
                    id: 'taskCalendarViewSubSplitPaneMode',
                    title: 'Task calendar view split pane mode',
                    type: 'select',
                    value: 'horizontal',
                    editable: true,
                    options: {
                        values: [
                            {
                                title: 'Horizontal',
                                value: 'horizontal'
                            },
                            {
                                title: 'Vertical',
                                value: 'vertical'
                            }
                        ]
                    }
                }
            ]
        }
    ];
}