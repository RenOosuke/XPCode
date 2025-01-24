let testDirectory = path.resolve('../TestDirectory')

function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

// const uniqueInstanceID = UUID();

// let packageData = fs.readFileSync('package.json', 'utf-8');
// let packageDataParsed = JSON.parse(packageData);
// packageDataParsed.name = `xpcode-${uniqueInstanceID}`;
// fs.writeFileSync('package.json', JSON.stringify(packageDataParsed), 'utf-8');

const appArguments = nw.App.fullArgv;

const appDimensions = {};

let SHOULD_USE_DEFAULT_SIZE = true;

{
    const dimensionKeys = [
        'width',
        'height',
        'x',
        'y'
    ];

    let nwWindow = nw.Window.get();

    const argumentsWithEqual = appArguments
    .filter((_argument) => _argument.includes('='))
    .reduce((acc, _argument) => {
        let [key, value] = _argument.split('=');
        acc[key.slice(2)] = value;

        return acc;
    }, {});

    dimensionKeys.forEach((key) => {
        let value = nwWindow[key];

        if(argumentsWithEqual[key]) {
            value = argumentsWithEqual[key]
            SHOULD_USE_DEFAULT_SIZE = false;
        }

        appDimensions[key] = parseFloat(value);
    });

    initialResize()
}

let lastLaunchArgument = appArguments[appArguments.length-1];

let workspaceDirectory;

{
    const filteredArguments = appArguments.filter((_arg) => {
        return _arg.indexOf('--') != 0
    });

    workspaceDirectory = filteredArguments[filteredArguments.length-1];
}


let directoryExists = fs.existsSync(workspaceDirectory);

workspaceDirectory = !DEV ? (workspaceDirectory) : (directoryExists ? (workspaceDirectory): (fs.existsSync(testDirectory) ? testDirectory : nw.__dirname)); // nw.App.fullArgv;

window.directory = path.basename(workspaceDirectory);

{
    let isDirectory = fs.statSync(workspaceDirectory).isDirectory();

    if(isDirectory && directoryExists) {
        let changedField = "temporary.recent.folders";
        let recentDirectories = settings.section.get(changedField);
        
        let uniqueRecentDirectories = new Set(recentDirectories);
        uniqueRecentDirectories.add(workspaceDirectory);
        let directoriesArr =  Array.from(uniqueRecentDirectories);
        recentDirectories.splice(0, recentDirectories.length);
        recentDirectories.push(...directoriesArr)
        settings.update();
        signals.write.settingChanged("temporary");
    } 
    
    if(!isDirectory && directoryExists) {
        let changedField = "temporary.recent.files"
        
        let recentFiles = settings.section.get(changedField);
        
        let uniqueRecentFiles = new Set(recentFiles);
        uniqueRecentFiles.add(workspaceDirectory);
        let filesArr = Array.from(uniqueRecentFiles);
        recentFiles.splice(0, recentFiles.length);
        recentFiles.push(...filesArr)
        settings.update();
        signals.write.settingChanged("temporary");
    };
}