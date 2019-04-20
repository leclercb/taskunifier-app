import moment from 'moment';

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
                    id: "automaticSave",
                    title: "Enable automatic save",
                    type: 'boolean',
                    value: true,
                    editable: true
                },
                {
                    id: "automaticSaveInterval",
                    title: "Save interval in minutes",
                    type: 'number',
                    value: 15,
                    editable: true
                },
                {
                    id: "lastAutomaticSave",
                    title: "Last automatic save",
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
                    id: "showStartTime",
                    title: "Show start time",
                    type: 'boolean',
                    value: false,
                    editable: true
                },
                {
                    id: "showDueTime",
                    title: "Show due time",
                    type: 'boolean',
                    value: false,
                    editable: true
                },
                {
                    id: "dateFormat",
                    title: "Date format",
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
                    id: "timeFormat",
                    title: "Time format",
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
                    id: "license",
                    title: "License",
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
                    id: "automaticBackup",
                    title: "Enable automatic backup",
                    type: 'boolean',
                    value: true,
                    editable: true
                },
                {
                    id: "maxBackups",
                    title: "Maximum number of backups to keep",
                    type: 'number',
                    value: 100,
                    editable: true
                },
                {
                    id: "automaticBackupInterval",
                    title: "Backup interval in minutes",
                    type: 'number',
                    value: 60,
                    editable: true
                },
                {
                    id: "lastAutomaticBackup",
                    title: "Last automatic backup",
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
                    id: "defaultTaskTemplate",
                    title: "Default task template",
                    type: 'taskTemplate',
                    value: null,
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
                    id: "importance_0",
                    title: "Importance 0",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "importance_1",
                    title: "Importance 1",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "importance_2",
                    title: "Importance 2",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "importance_3",
                    title: "Importance 3",
                    type: 'color',
                    value: '#f0f7f7',
                    editable: true
                },
                {
                    id: "importance_4",
                    title: "Importance 4",
                    type: 'color',
                    value: '#ccffff',
                    editable: true
                },
                {
                    id: "importance_5",
                    title: "Importance 5",
                    type: 'color',
                    value: '#d0f7e3',
                    editable: true
                },
                {
                    id: "importance_6",
                    title: "Importance 6",
                    type: 'color',
                    value: '#ccffcc',
                    editable: true
                },
                {
                    id: "importance_7",
                    title: "Importance 7",
                    type: 'color',
                    value: '#ccff99',
                    editable: true
                },
                {
                    id: "importance_8",
                    title: "Importance 8",
                    type: 'color',
                    value: '#ffffcc',
                    editable: true
                },
                {
                    id: "importance_9",
                    title: "Importance 9",
                    type: 'color',
                    value: '#ffff99',
                    editable: true
                },
                {
                    id: "importance_10",
                    title: "Importance 10",
                    type: 'color',
                    value: '#ffcc99',
                    editable: true
                },
                {
                    id: "importance_11",
                    title: "Importance 11",
                    type: 'color',
                    value: '#ffcccc',
                    editable: true
                },
                {
                    id: "importance_12",
                    title: "Importance 12",
                    type: 'color',
                    value: '#ff9999',
                    editable: true
                }
            ]
        },
        {
            id: 'priorityColors',
            title: 'Priority Colors',
            icon: 'paint-roller',
            settings: [
                {
                    id: "priority_negative",
                    title: "Priority Negative",
                    type: 'color',
                    value: '#f0f7f7',
                    editable: true
                },
                {
                    id: "priority_low",
                    title: "Priority Low",
                    type: 'color',
                    value: '#00ff00',
                    editable: true
                },
                {
                    id: "priority_medium",
                    title: "Priority Medium",
                    type: 'color',
                    value: '#ffff00',
                    editable: true
                },
                {
                    id: "priority_high",
                    title: "Proirity High",
                    type: 'color',
                    value: '#ffc800',
                    editable: true
                },
                {
                    id: "priority_top",
                    title: "Priority Top",
                    type: 'color',
                    value: '#ff0000',
                    editable: true
                }
            ]
        },
        {
            id: 'statusColors',
            title: 'Status Colors',
            icon: 'paint-roller',
            settings: [
                {
                    id: "status_active",
                    title: "Status Active",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_cancelled",
                    title: "Status Cancelled",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_delegated",
                    title: "Status Delegated",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_hold",
                    title: "Status Hold",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_nextAction",
                    title: "Status Next Action",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_none",
                    title: "Status None",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_planning",
                    title: "Status Planning",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_postponed",
                    title: "Status Postponed",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_reference",
                    title: "Status Reference",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_someday",
                    title: "Status Someday",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "status_waiting",
                    title: "Status Waiting",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                }
            ]
        },
        {
            id: 'window',
            title: 'Window',
            icon: 'desktop',
            settings: [
                {
                    id: "windowSizeWidth",
                    title: "Window Size - Width",
                    type: 'number',
                    value: 1024,
                    editable: false
                },
                {
                    id: "windowSizeHeight",
                    title: "Window Size - Height",
                    type: 'number',
                    value: 768,
                    editable: false
                },
                {
                    id: "windowPositionX",
                    title: "Window Position - X",
                    type: 'number',
                    value: null,
                    editable: false
                },
                {
                    id: "windowPositionY",
                    title: "Window Position - Y",
                    type: 'number',
                    value: null,
                    editable: false
                }
            ]
        }
    ]
}