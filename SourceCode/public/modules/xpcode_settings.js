{
    /** modules.js */
    const GENERAL_SHORTCUTS = 'shortcuts.general';
    const SETTINGS_PATH = `${GENERAL_SHORTCUTS}.settings`;
    const SHORTCUTS_PATH = `${GENERAL_SHORTCUTS}.shortcuts`;
    const COLOR_THEME_PATH = `${GENERAL_SHORTCUTS}.color_theme`;
    let _parentDir = path.resolve('public/data');
    let pathToSettings = path.resolve('public/data/settings.json');
    let defaultSettings = {
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
            }
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
                color_theme: "Ctrl__k__t"
            },
            sidebar: {

            }
        },

        variables: {
            explorer: {
                x_offset: '0px'
            }
        }
    }

    if(!fs.existsSync(_parentDir)) {
        mkdirSync(_parentDir);
    };

    if(!fs.existsSync(pathToSettings)) {
        fs.writeFileSync(pathToSettings, JSON.stringify(defaultSettings), 'utf8');
    }
    
    let _get = () => {
        return JSON.parse(fs.readFileSync(pathToSettings, 'utf-8'));
    }

    let _currentSettings = _get();

    let _update = () => {
        fs.writeFileSync(pathToSettings, JSON.stringify(_currentSettings), 'utf-8');
    }

    let _set = (newSettings) => {
        _currentSettings = spreader(newSettings);
    }

    let safePath = (sectionName) => {
        let steps = sectionName.split('.');

        steps.reduce((acc, step) => {
            let propertyExists;

            acc.push(step);
            
            // console.log(acc);

            let propertyChain = `_currentSettings.${acc.join('.')}`
            eval(`propertyExists = ${propertyChain}`);

            if(!propertyExists) {
                console.log(propertyExists);
                eval(`${propertyChain} = {}`);
            };

            return acc;
        },[]);
    }

    let _settings = {
        get: _get,
        set: _set,
        section: {
            get: (sectionName) => {
                let sectionToReturn;

                if(sectionName.includes('.')) {

                    safePath(sectionName);

                    eval(`sectionToReturn = _currentSettings.${sectionName}`);
                } else {
                    console.log(sectionName, _get()[sectionName])
                   sectionToReturn = _get()[sectionName] || {}
                };

                return sectionToReturn;
            },
            set: (sectionName, sectionData) => {
                if(sectionName.includes('.')) {

                    safePath(sectionName);
                    
                    let stringToEvaluate = `_currentSettings.${sectionName} = ${sectionData}`; 
                    eval(stringToEvaluate);
                } else {
                    _currentSettings = spreader(_currentSettings, {[sectionName]: sectionData})
                };

                _set(_currentSettings);
            }
        },
        update: _update,
        contextMenu: {
            preferences: () => {
                return [
                    { label: "Profiles", name: "profiles"},
                    { label: "Settings", name: "settings", shortcut: shortcuts.combinationFromSettings(SETTINGS_PATH)},
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
    }

    window.settings = _settings;

    window.addEventListener('beforeunload', () => {
        settings.update();
        alert('Updated settings!');
    });

    let CSSPropertiesToReadOnStart = [
        'side-tab-offset',
    ]

    CSSPropertiesToReadOnStart.forEach((propName) => {
        let parsedPropName = `--${propName}`;
        let settingsKey = themeUtils.settingToPropertyTranslator(parsedPropName);
        let value = settings.section.get(settingsKey);

        themeUtils.setProperty(parsedPropName, value);
    })

    let CSSPropertiesToInitialize = {
        '--terminal-y-offset': '0px'
    };

    Object.keys(CSSPropertiesToInitialize).forEach((key) => {
        themeUtils.setProperty(key, CSSPropertiesToInitialize[key]);
    })

    themeUtils.endInitialLoad();
}