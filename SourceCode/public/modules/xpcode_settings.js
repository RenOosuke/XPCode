{
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
        }
    }

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
        update: _update
    }

    window.settings = _settings;
}