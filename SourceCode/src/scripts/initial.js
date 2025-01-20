let testDirectory = path.resolve('../TestDirectory')

function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

const uniqueInstanceID = UUID();

let packageData = fs.readFileSync('package.json', 'utf-8');
let packageDataParsed = JSON.parse(packageData);
packageDataParsed.name = `xpcode-${uniqueInstanceID}`;
fs.writeFileSync('package.json', JSON.stringify(packageDataParsed), 'utf-8');

let lastLaunchArgument = nw.App.fullArgv[nw.App.fullArgv.length-1];
let launchArgumentExists = fs.existsSync(lastLaunchArgument);

window.launchArguments = !DEV ? (lastLaunchArgument) : (launchArgumentExists ? (lastLaunchArgument): (fs.existsSync(testDirectory) ? testDirectory : nw.__dirname)); // nw.App.fullArgv;

window.directory = path.basename(launchArguments);

{
    let isDirectory = fs.statSync(launchArguments).isDirectory();

    if(isDirectory && launchArgumentExists) {
        let changedField = "temporary.recent.folders";
        let recentDirectories = settings.section.get(changedField);
        
        let uniqueRecentDirectories = new Set(recentDirectories);
        uniqueRecentDirectories.add(launchArguments);
        let directoriesArr =  Array.from(uniqueRecentDirectories);
        recentDirectories.splice(0, recentDirectories.length);
        recentDirectories.push(...directoriesArr)
        settings.update();
        signals.write.settingChanged("temporary");
    } 
    
    if(!isDirectory && launchArgumentExists) {
        let changedField = "temporary.recent.files"
        
        let recentFiles = settings.section.get(changedField);
        
        let uniqueRecentFiles = new Set(recentFiles);
        uniqueRecentFiles.add(launchArguments);
        let filesArr = Array.from(uniqueRecentFiles);
        recentFiles.splice(0, recentFiles.length);
        recentFiles.push(...filesArr)
        settings.update();
        signals.write.settingChanged("temporary");
    };
}