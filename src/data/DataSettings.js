import moment from 'moment';
import { getPriorities } from './DataPriorities';
import { getStatuses } from './DataStatuses';
import { getUserDataPath } from '../utils/ActionUtils';

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
            settings[setting.id] = setting.value;
        });
    });

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
            title: 'Task Templates',
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
                    id: 'evenColor',
                    title: 'Even Color',
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: 'oddColor',
                    title: 'Odd Color',
                    type: 'color',
                    value: '#e8f1f7',
                    editable: true
                }
            ]
        },
        {
            id: 'importanceColors',
            title: 'Importance Colors',
            icon: 'paint-roller',
            settings: [
                {
                    id: 'importance_0',
                    title: 'Importance 0',
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: 'importance_1',
                    title: 'Importance 1',
                    type: 'color',
                    value: '#ffffff',
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
                    value: '#e1f5fe',
                    editable: true
                },
                {
                    id: 'importance_4',
                    title: 'Importance 4',
                    type: 'color',
                    value: '#b3e5fc',
                    editable: true
                },
                {
                    id: 'importance_5',
                    title: 'Importance 5',
                    type: 'color',
                    value: '#dcedc8',
                    editable: true
                },
                {
                    id: 'importance_6',
                    title: 'Importance 6',
                    type: 'color',
                    value: '#c5e1a5',
                    editable: true
                },
                {
                    id: 'importance_7',
                    title: 'Importance 7',
                    type: 'color',
                    value: '#fff9c4',
                    editable: true
                },
                {
                    id: 'importance_8',
                    title: 'Importance 8',
                    type: 'color',
                    value: '#fff176',
                    editable: true
                },
                {
                    id: 'importance_9',
                    title: 'Importance 9',
                    type: 'color',
                    value: '#ffe082',
                    editable: true
                },
                {
                    id: 'importance_10',
                    title: 'Importance 10',
                    type: 'color',
                    value: '#ffd54f',
                    editable: true
                },
                {
                    id: 'importance_11',
                    title: 'Importance 11',
                    type: 'color',
                    value: '#ffab91',
                    editable: true
                },
                {
                    id: 'importance_12',
                    title: 'Importance 12',
                    type: 'color',
                    value: '#ff5722',
                    editable: true
                }
            ]
        },
        {
            id: 'priorityColors',
            title: 'Priority Colors',
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
            title: 'Status Colors',
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
                    id: 'windowSizeWidth',
                    title: 'Window Size - Width',
                    type: 'number',
                    value: 1024,
                    editable: false,
                    core: true
                },
                {
                    id: 'windowSizeHeight',
                    title: 'Window Size - Height',
                    type: 'number',
                    value: 768,
                    editable: false,
                    core: true
                },
                {
                    id: 'windowPositionX',
                    title: 'Window Position - X',
                    type: 'number',
                    value: null,
                    editable: false,
                    core: true
                },
                {
                    id: 'windowPositionY',
                    title: 'Window Position - Y',
                    type: 'number',
                    value: null,
                    editable: false,
                    core: true
                },
                {
                    id: 'verticalSplitPaneSize',
                    title: 'Vertical Split Pane Size',
                    type: 'number',
                    value: 300,
                    editable: false
                },
                {
                    id: 'horizontalSplitPaneSize',
                    title: 'Horizontal Split Pane Size',
                    type: 'number',
                    value: 300,
                    editable: false
                }
            ]
        }
    ];
}