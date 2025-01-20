{
    const OPEN_FILE = "open_file";
    const SETTINGS_CHANGED = "settings_changed";

    const currentSessionName = nw.App.manifest.name;

    fs.writeFile(`${EXECUTABLES_PATH}\\last_session.txt`, currentSessionName, {encoding: 'utf-8'});

    let signalFile = path.resolve(`${EXECUTABLES_PATH}\\signal.txt`);

    const executeCommand = (command) => {
        let commandParams = command.split(" ");
        let firstParam = commandParams[0]; 
        if(firstParam == OPEN_FILE && commandParams[1] == currentSessionName) {
            let filePath = commandParams.slice(2).join(" ");
            TODO("ADD option to open files");
            alert("TODO => this window should open " + filePath);
        }

        if(firstParam == SETTINGS_CHANGED && commandParams[1] != currentSessionName) {
            let settingFieldChanged = commandParams.slice(2).join(" ");
            console.log("Should log a settings change here " + settingFieldChanged);
            let newSettings = settings.get();
            let newFieldData;
            
            eval(`newFieldData = newSettings.${settingFieldChanged}`);

            settings.section.set(settingFieldChanged, newFieldData);
        }
    }

    let onCooldown = false

    fs.watch(signalFile, (eventType, filename) => {
        if(onCooldown) {
            return true;
        }

        onCooldown = true;

        setTimeout(() => {
            onCooldown = false;
        }, 2000)

        if (eventType === 'change') {
            fs.readFile(signalFile, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    executeCommand(data);
                }
            });
        }
    });

    window.signals = {
        write: (() => {
            const writeSignal = (messageParams) => {
                fs.writeFile(signalFile, messageParams.join(' '), 'utf8');
            };

            return {
                settingChanged: (field) => {
                    writeSignal([SETTINGS_CHANGED, currentSessionName, field]);
                }
            }
        })()
    }
}