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