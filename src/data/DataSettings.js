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
                    category: "general",
                    type: 'checkbox',
                    value: true,
                    editable: true
                },
                {
                    id: "automatic_save_interval",
                    title: "Save interval in minutes",
                    category: "general",
                    type: 'number',
                    value: 15,
                    editable: true
                },
                {
                    id: "last_automatic_save",
                    title: "Last automatic save",
                    category: "general",
                    type: 'datetime',
                    value: moment().toString(),
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
                    category: "license",
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
                    category: "backup",
                    type: 'checkbox',
                    value: true,
                    editable: true
                },
                {
                    id: "max_backups",
                    title: "Maximum number of backups to keep",
                    category: "backup",
                    type: 'number',
                    value: 100,
                    editable: true
                },
                {
                    id: "automatic_backup_interval",
                    title: "Backup interval in minutes",
                    category: "backup",
                    type: 'number',
                    value: 60,
                    editable: true
                },
                {
                    id: "last_automatic_backup",
                    title: "Last automatic backup",
                    category: "backup",
                    type: 'datetime',
                    value: moment().toString(),
                    editable: false
                }
            ]
        },
        {
            id: 'colors',
            title: 'Colors',
            icon: 'paint-roller',
            settings: [
                {
                    id: "importance_0",
                    title: "Importance 0",
                    category: "colors",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "importance_1",
                    title: "Importance 1",
                    category: "colors",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "importance_2",
                    title: "Importance 2",
                    category: "colors",
                    type: 'color',
                    value: '#ffffff',
                    editable: true
                },
                {
                    id: "importance_3",
                    title: "Importance 3",
                    category: "colors",
                    type: 'color',
                    value: '#f0f7f7',
                    editable: true
                },
                {
                    id: "importance_4",
                    title: "Importance 4",
                    category: "colors",
                    type: 'color',
                    value: '#ccffff',
                    editable: true
                },
                {
                    id: "importance_5",
                    title: "Importance 5",
                    category: "colors",
                    type: 'color',
                    value: '#d0f7e3',
                    editable: true
                },
                {
                    id: "importance_6",
                    title: "Importance 6",
                    category: "colors",
                    type: 'color',
                    value: '#ccffcc',
                    editable: true
                },
                {
                    id: "importance_7",
                    title: "Importance 7",
                    category: "colors",
                    type: 'color',
                    value: '#ccff99',
                    editable: true
                },
                {
                    id: "importance_8",
                    title: "Importance 8",
                    category: "colors",
                    type: 'color',
                    value: '#ffffcc',
                    editable: true
                },
                {
                    id: "importance_9",
                    title: "Importance 9",
                    category: "colors",
                    type: 'color',
                    value: '#ffff99',
                    editable: true
                },
                {
                    id: "importance_10",
                    title: "Importance 10",
                    category: "colors",
                    type: 'color',
                    value: '#ffcc99',
                    editable: true
                },
                {
                    id: "importance_11",
                    title: "Importance 11",
                    category: "colors",
                    type: 'color',
                    value: '#ffcccc',
                    editable: true
                },
                {
                    id: "importance_12",
                    title: "Importance 12",
                    category: "colors",
                    type: 'color',
                    value: '#ff9999',
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
                    category: "window",
                    type: 'number',
                    value: 1024,
                    editable: false
                },
                {
                    id: "window_size_height",
                    title: "Window Size - Height",
                    category: "window",
                    type: 'number',
                    value: 768,
                    editable: false
                },
                {
                    id: "window_position_x",
                    title: "Window Position - X",
                    category: "window",
                    type: 'number',
                    value: null,
                    editable: false
                },
                {
                    id: "window_position_y",
                    title: "Window Position - Y",
                    category: "window",
                    type: 'number',
                    value: null,
                    editable: false
                }
            ]
        }
    ]
}