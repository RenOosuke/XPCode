const SETTINGS_SORT_PATH = "explorer_tabs.outline.sort";

{
    /** modules.js */
    const GENERAL_SHORTCUTS = 'shortcuts.general';
    const SETTINGS_CONFIG_PATH = `${GENERAL_SHORTCUTS}.settings`;
    const SHORTCUTS_PATH = `${GENERAL_SHORTCUTS}.shortcuts`;
    const COLOR_THEME_PATH = `${GENERAL_SHORTCUTS}.color_theme`;
     
    let _parentDir = path.resolve('public/data');
    const SETTINGS_PATH = path.resolve('public/data/settings.json');
    const DEFAULT_SETTINGS = {
        explorer_tabs: {
            show: {
                files: {
                    timeline: true,
                    outline: true,
                    open_editors: true,
                    folders: true,
                    npm_scripts: true,
                },
                git: {

                },
                debug: {

                }
            },
            outline: {
                sort: "sort_outline_by_position"
            },
        },

        shortcuts: {
            file_explorer: {
                rename: "F2",
                delete: "Delete",
                new_file: "Win__n",
                new_folder: "Win__Alt__n",
                reveal_in_file_explorer: "Shift__Alt__r",
                copy: "Ctrl__c",
                cut: "Ctrl__x",
                paste: "Ctrl__v",
            },
            general: {
                search_by_file_name: "Ctrl__p",
                command_palette: "Ctrl__Shift__p",
                settings: "Ctrl__,",
                shortcuts: "Ctrl__k__s",
                color_theme: "Ctrl__k__t",
                zoom_in: "Ctrl__+",
                zoom_out: "Ctrl__-",
                zoom_in_alternative: "Ctrl__=",
            },
            sidebar: {

            }
        },

        variables: {
            explorer: {
                x_offset: '0px'
            }
        },

        temporary: {
            recent: {
                folders: [],
                files: [],
            }
        }
    }

    class SettingsManager {
        constructor() {
            this._ensureSettingsFile();
            this.settings = this._loadSettings();
            this._watchSettingsFile();
        }

        /** Ensures the settings file exists */
        _ensureSettingsFile() {
            const dir = path.dirname(SETTINGS_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            if (!fs.existsSync(SETTINGS_PATH)) this._saveSettings(DEFAULT_SETTINGS);
        }

        /** Loads settings from the JSON file */
        _loadSettings() {
            try {
                return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
            } catch (error) {
                console.error("Error loading settings:", error);
                return Object.assign({}, DEFAULT_SETTINGS);
            }
        }

        /** Saves settings to file atomically */
        _saveSettings(newSettings) {
            this.settings = Object.assign({}, this.settings, newSettings);
            this.save();
        }

        /** Get a setting by path (dot notation) */
        get(section) {
            return section.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : {}, this.settings);
        }

        /** Set a setting by path (dot notation) */
        set(section, value, shouldSave) {
            const keys = section.split('.');
            let obj = this.settings;
            while (keys.length > 1) {
                const key = keys.shift();
                obj[key] = obj[key] || {};
                obj = obj[key];
            }
            obj[keys[0]] = value;

            if(shouldSave) {
                this._saveSettings(this.settings);
            }
        }

        save() {
            fs.writeFileSync(SETTINGS_PATH + '.tmp', JSON.stringify(this.settings, null, 4), 'utf8');
            fs.renameSync(SETTINGS_PATH + '.tmp', SETTINGS_PATH);
        }

        /** Watches the settings file for external changes */
        _watchSettingsFile() {
            fs.watch(SETTINGS_PATH, (eventType) => {
                if (eventType === 'change') {
                    const updatedSettings = this._loadSettings();
                    // let editedBy = updatedSettings.editedBy;
                    
                    if (JSON.stringify(updatedSettings) !== JSON.stringify(this.settings)) {
                        this.settings = updatedSettings;
                    }
                }
            });
        }

        contextMenu = {
            preferences: () => {
                return [
                    { label: "Profiles", name: "profiles"},
                    { label: "Settings", name: "settings", shortcut: shortcuts.combinationFromSettings(SETTINGS_CONFIG_PATH)},
                    { label: "Keyboard Shortcuts", name: "keyboard_shortcuts", shortcut: shortcuts.combinationFromSettings(SHORTCUTS_PATH)},
                    { label: "Snippets", name: "snippets"},

                    { label: "Tasks", name: "tasks" },
                    { label: "Themes", name: "themes", options: [
                        {
                            label: "Color Theme",
                            name: "color_theme",
                            shortcut: shortcuts.combinationFromSettings(COLOR_THEME_PATH)
                        },
                        {
                            label: "File Icon Theme",
                            name: "file_icon_theme"
                        },
                        {
                            label: "Product Icon Theme",
                            name: "product_icon_theme"
                        }
                    ]}
                ]
            }
        }

        /** Logs current settings */
        log() {
            console.log(this.settings);
        }
    }

    // Attach the class instance to the global `window.settings`
    window.settings = new SettingsManager();

    processessCleanQueue.push(() => settings.save())
}