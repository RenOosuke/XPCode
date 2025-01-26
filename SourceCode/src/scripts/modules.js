/** modules.js */
window.timeA = new Date().getTime();

window.voidFunction = () => {return};
window.DEV = nw.App.manifest.DEV;

window.fs = require("fs");

if(parseInt(require("os").release()) < 10) {
    fs.realpathSync = function (p, options) {
        try {
            return path.resolve(p);
        } catch (e) {
            if (e.code === 'ENOSYS') {
                // Fallback to `path.resolve` if `realpathSync` is unsupported
                console.log("Have to try to fix it somehow");
            }
            throw e;
        }
    };
}

window.range = function (start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

let ignoreTodos = false;
let ToDoList = new Set([]);

window.TODO = (todoMessage) => {
    if(!ignoreTodos) {
        console.log(`|====================== To Do: ${todoMessage} ===============================|`);
    }

    ToDoList.add(todoMessage);
}

window.child_process = require('child_process');


window.setTheme = function(themeName) {
    var foldersElement =  $('#explorer')[0];
    var oldClasses = [];

    // foldersElement.className = foldersElement.className.split(' ').filter(function(clsname) {return clsname.indexOf('ace')<0}).join(' ') + '  ace-' + themeName;

    vscode.setTheme(`ace/theme/${themeName}`);
}

function closeIt()
{
    cmds.cleanAll();

    // TODO IF NOT SAVED
    if(false) {
        return "Any string value here forces a dialog box to \n" + 
               "appear before closing the window.";
    }
}

// window.onbeforeunload = closeIt;

// window.cmds = (function () {
//     var _cmds = [];
//     window.terminals = [];

//     function _add (cliType) {
//         var commandToSpawn;
//         var commandName;
//         var currentLocation = path.dirname((window.folderDirectory ||  window.location.pathname.slice(1)));
//         var isFirstOut = true;

//         switch(cliType) {
//             case 'cmd':
//                 commandToSpawn = 'cmd.exe';
//                 commandName = 'Command Prompt';
//                 break;
//             case 'pws':
//                 commandToSpawn = 'powershell.exe';
//                 commandName = 'powershell';
//                 break;
//             default:
//                 commandToSpawn = 'cmd.exe';
//                 commandName = 'Command Prompt';
//         }
//         var newCmd = child_process.spawn(commandToSpawn, [], {
//             detached: true,
//             stdio: ['pipe', 'pipe', 'pipe']
//           });
        
//         _cmds.push(newCmd)

//         var newCmdLogs = {
//             logs: []
//         };

//         var _logs = newCmdLogs.logs; 
//         var functionToUpdateCmd = (window.cmdUpdate || function(){console.log(newCmdLogs)});
//         // var lastStdOut = (_logs[_logs.length-1] || '') + '> ' + msg; _logs[_logs.length-1] = lastStdOut
//         var _write = function (msg) {console.log('WRITE GOT CALLED========='); newCmd.stdin.write(msg + '\n'); functionToUpdateCmd()}

//         newCmd.stdout.on('data', function (data) {
//             _logs.push(data.toString());

//             // if(isFirstOut) {
//             //     _logs.push(currentLocation);
//             //     isFirstOut = false;
//             // }

//             functionToUpdateCmd();
//         });
          
//         newCmd.stderr.on('data', function (data) {
//             _logs.push(data.toString());
            
//             functionToUpdateCmd()
//         });

//         newCmdLogs.write = _write;
//         window.terminals.push(newCmdLogs);
//     }

//     function _remove (index) {
//         _cmds[index].kill();
//         _cmds.splice(index, 1);
//     }

//     function _cleanAll () {
//         _cmds.forEach(function(_cmd) {
//             try {
//                 _cmd.kill();
//             } catch (e) {
//                 console.log(e);
//             }
//         })
//     }

//     return {
//         remove: _remove,
//         add: _add,
//         cleanAll: _cleanAll
//     }
// })()

window.spreader = (...objs) =>  {
    const mergedObj = {};

    if(objs.length>2) {
        return spreader(spreader(objs.splice(0, 2)), objs);
    } else {
            let [obj1, obj2] = objs;
        // Manually copying properties
            for (const key in obj1) {
                if (obj1.hasOwnProperty(key)) {
                    mergedObj[key] = obj1[key];
                }
            }
        
            for (const key in obj2) {
                if (obj2.hasOwnProperty(key)) {
                    mergedObj[key] = obj2[key];
                }
            } 
    };

    return mergedObj;
}

{
    let isInitialLoad = true;

    window.themeUtils = {
        isDark: true,
        iconsPath: () => {
            let mode =  themeUtils.isDark ? 'dark' : 'light';
            let iconsPath = path.join(paths.icons, mode);
            return iconsPath.split('\\').join('/');
        },
        changeTheme: (themeName) => {
            let themesFolderPath = path.resolve("../themes/");
            let themeFolderPath = path.join(themesFolderPath, themeName);
            let configFilePath = path.join(themeFolderPath, 'config.json');
            let configFile = readJSON(configFilePath);
            let themeFilePath = path.join(themeFolderPath, 'theme.css');
            let themeContent =  fs.readFileSync(themeFilePath, 'utf-8');

            themeUtils.isDark = configFile.isDark
            
            let iconsPath = themeUtils.iconsPath();
            
            themeContent += `
                .expanded .arrow-icon {
                    -webkit-mask: url('${iconsPath}/chevron-down.svg') no-repeat center;
                }
                    
                .expanded > .header-part > .left-side > .arrow-placeholder > .arrow-icon {
                    -webkit-mask: url('${iconsPath}/chevron-down.svg') no-repeat center;
                }
            `
            
            let iconNames = [
                'files',
                'search',
                'debug',
                'account',
                'settings',
                'left_arrow',
                'right_arrow',
                'more',
                'git',
                'chevron-right',
                'chevron-left',
                'chevron-down',
                'chevron-up',
                'close-all-editors',
                'collapse-all',
                'expand-all',
                'filter',
                'new-file',
                'new-folder',
                'pin',
                'refresh',
                'save-all',
                'split-horizontal',
                'close'
            ];
    
            iconNames.forEach((iconName) => {
                themeContent += `
                    .var-${iconName}-icon {
                        -webkit-mask: url('${iconsPath}/${iconName}.svg') no-repeat center;
                    }
                `
            });
    
            jQuery(".theme_file")[0].innerText = themeContent;
        },
    
        setGrayedOut: () => {
            {
                let bool = file_explorer.grayedOut;
        
                let folderTab = jQuery('.explorer-tab-header.folder')[0];
        
                if(folderTab) {
                    if(bool) {
                        folderTab.classList.add('grayed-out')
                    } else {
                        folderTab.classList.remove('grayed-out')
                    }
                }
            }

            {
                let bool = outline.grayedOut;

                let outlineTab = jQuery('.explorer-tab-header.outline')[0];
        
                if(outlineTab) {
                    if(bool) {
                        outlineTab.classList.add('grayed-out')
                    } else {
                        outlineTab.classList.remove('grayed-out')
                    }
                }
            }
        },
        settingToPropertyTranslator: (key) => {
            let prop2key = {
                '--side-tab-offset': SETTING_VARIABLES.VARIABLES_EXPLORER_X_OFFSET,
    
            }
    
            let key2prop = {
                [SETTING_VARIABLES.VARIABLES_EXPLORER_X_OFFSET]:'--side-tab-offset',
            }
    
            return prop2key[key] || key2prop[key];
        },
        getValueType: (key) => {
            let valueParsingFunction = (val) => {
                return val
            };

            switch(key){
                case SETTING_VARIABLES.VARIABLES_EXPLORER_X_OFFSET:
                    valueParsingFunction = (val) => {
                        return `"${val}"`;
                    }
                break; 
            }

            return valueParsingFunction;
        },
        setProperty: (_property, value, priority) => {
    
            let settingKey = themeUtils.settingToPropertyTranslator(_property);
    
            if(settingKey && !isInitialLoad) {
                let valueParser = themeUtils.getValueType(settingKey);
                let parsedValue = valueParser(value);
                settings.section.set(settingKey, parsedValue)
            }
    
            document.documentElement.style.setProperty(_property, value, priority)
        },
        endInitialLoad: () => {
            isInitialLoad = false;
            delete themeUtils.endInitialLoad;
        }
    }
}

window.VSCode = {
    original: {
        
    },
    xpcode: {

    }
}

nw.App.relaunchWithArgs = function (newDirectory, shouldQuit) {
    // const appPath = nw.App.argv[0] || process.execPath; // Path to the app executable
    // const args = newArgs.join(' '); // Combine new arguments into a single string
    let newLaunchArguments = [...nw.App.fullArgv];

    newLaunchArguments = newLaunchArguments.filter((_arg) => {
        return _arg !== workspaceDirectory
        && _arg.indexOf('--height') < 0
        && _arg.indexOf('--width') < 0
        && _arg.indexOf('--y') < 0
        && _arg.indexOf('--x') < 0
    });

    newLaunchArguments.push(...[`--height=${nwWindow.height}`, `--width=${nwWindow.width}`, `--y=${nwWindow.y}`, `--x=${nwWindow.x}`]);

    if(newDirectory) {
        let XPSafeNewDirectory = `"${newDirectory}"`;
    
        if(directoryExists) {
          newLaunchArguments = newLaunchArguments.filter((_arg) => _arg !== workspaceDirectory);
        } 
        
        newLaunchArguments.push(XPSafeNewDirectory);
    }

    let XPSafeNWPath = `"${(nw.process || process).execPath}"`;
    // // Relaunch the app with new arguments 
    const commandToExecute = `${XPSafeNWPath} . ${newLaunchArguments.join(" ")}`;

    // let child_app = child_process.spawn(commandToExecute, {} ,() => {});
    // let child_app = child_process.spawnSync(XPSafeNWPath, ['.', ...newLaunchArguments], {detached: true, stdio: 'ignore', windowsHide: false});
    child_process.exec(commandToExecute, {stdio: 'ignore', detached: true}, (err, stdout, stderr)  => {

    });

    setTimeout(() => {
        if(shouldQuit) {
            nw.App.quit();
        }
    }, 30)
}

window.processessCleanQueue = [];