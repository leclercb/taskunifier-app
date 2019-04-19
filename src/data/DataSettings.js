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
                    id: "automatic_save",
                    title: "Enable automatic save",
                    type: 'checkbox',
                    value: true,
                    editable: true
                },
                {
                    id: "automatic_save_interval",
                    title: "Save interval in minutes",
                    type: 'number',
                    value: 15,
                    editable: true
                },
                {
                    id: "last_automatic_save",
                    title: "Last automatic save",
                    type: 'datetime',
                    value: moment().toJSON(),
                    editable: false
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
                    id: "automatic_backup",
                    title: "Enable automatic backup",
                    type: 'checkbox',
                    value: true,
                    editable: true
                },
                {
                    id: "max_backups",
                    title: "Maximum number of backups to keep",
                    type: 'number',
                    value: 100,
                    editable: true
                },
                {
                    id: "automatic_backup_interval",
                    title: "Backup interval in minutes",
                    type: 'number',
                    value: 60,
                    editable: true
                },
                {
                    id: "last_automatic_backup",
                    title: "Last automatic backup",
                    type: 'datetime',
                    value: moment().toJSON(),
                    editable: false
                }
            ]
        },
        {
            id: 'task_templates',
            title: 'Task Templates',
            icon: 'tasks',
            settings: [
                {
                    id: "default_task_template",
                    title: "Default task template",
                    type: 'task-template',
                    value: null,
                    editable: true
                }
            ]
        },
        {
            id: 'importance_colors',
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
            id: 'priority_colors',
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
            id: 'task_status_colors',
            title: 'Status Colors',
            icon: 'paint-roller',
            settings: [
                {
                    id: "task_status_active",
                    title: "Status Active",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_cancelled",
                    title: "Status Cancelled",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_delegated",
                    title: "Status Delegated",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_hold",
                    title: "Status Hold",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_next_action",
                    title: "Status Next Action",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_none",
                    title: "Status None",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_planning",
                    title: "Status Planning",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_postponed",
                    title: "Status Postponed",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_reference",
                    title: "Status Reference",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_someday",
                    title: "Status Someday",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "task_status_waiting",
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
                    id: "window_size_width",
                    title: "Window Size - Width",
                    type: 'number',
                    value: 1024,
                    editable: false
                },
                {
                    id: "window_size_height",
                    title: "Window Size - Height",
                    type: 'number',
                    value: 768,
                    editable: false
                },
                {
                    id: "window_position_x",
                    title: "Window Position - X",
                    type: 'number',
                    value: null,
                    editable: false
                },
                {
                    id: "window_position_y",
                    title: "Window Position - Y",
                    type: 'number',
                    value: null,
                    editable: false
                }
            ]
        }
    ]
}