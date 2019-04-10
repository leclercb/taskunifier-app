export function getSettings() {
    const settings = {}

    getCategories().forEach(category => {
        Object.keys(category.settings).forEach(key => {
            settings[key] = category.settings[key].value;
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
            settings: {

            }
        },
        {
            id: 'backup',
            title: 'Backup',
            icon: 'save',
            settings: {
                "automatic_backups": {
                    "title": "Enable automatic backups",
                    "category": "backup",
                    "value": true,
                    "visible": true
                },
                "backup_interval": {
                    "title": "Backup interval in minutes",
                    "category": "backup",
                    "value": 60,
                    "visible": true
                },
                "last_backup": {
                    "title": "Last backup date",
                    "category": "backup",
                    "value": null,
                    "visible": false
                }
            }
        }
    ]
}