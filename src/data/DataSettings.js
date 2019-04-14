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
            settings: []
        },
        {
            id: 'backup',
            title: 'Backup',
            icon: 'save',
            settings: [
                {
                    id: "automatic_backups",
                    title: "Enable automatic backups",
                    category: "backup",
                    type: 'checkbox',
                    value: true,
                    visible: true
                },
                {
                    id: "backup_interval",
                    title: "Backup interval in minutes",
                    category: "backup",
                    type: 'number',
                    value: 60,
                    visible: true
                },
                {
                    id: "last_backup",
                    title: "Last backup date",
                    category: "backup",
                    type: 'text',
                    value: null,
                    visible: true
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
                    visible: true
                },
                {
                    id: "window_size_height",
                    title: "Window Size - Height",
                    category: "window",
                    type: 'number',
                    value: 768,
                    visible: true
                },
                {
                    id: "window_position_x",
                    title: "Window Position - X",
                    category: "window",
                    type: 'number',
                    value: null,
                    visible: true
                },
                {
                    id: "window_position_y",
                    title: "Window Position - Y",
                    category: "window",
                    type: 'number',
                    value: null,
                    visible: true
                }
            ]
        }
    ]
}