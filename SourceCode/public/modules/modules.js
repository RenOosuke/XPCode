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

window.onbeforeunload = closeIt;

window.cmds = (function () {
    var _cmds = [];
    window.terminals = [];

    function _add (cliType) {
        var commandToSpawn;
        var commandName;
        var currentLocation = path.dirname((window.folderDirectory ||  window.location.pathname.slice(1)));
        var isFirstOut = true;

        switch(cliType) {
            case 'cmd':
                commandToSpawn = 'cmd.exe';
                commandName = 'Command Prompt';
                break;
            case 'pws':
                commandToSpawn = 'powershell.exe';
                commandName = 'powershell';
                break;
            default:
                commandToSpawn = 'cmd.exe';
                commandName = 'Command Prompt';
        }
        var newCmd = child_process.spawn(commandToSpawn, [], {
            detached: true,
            stdio: ['pipe', 'pipe', 'pipe']
          });
        
        _cmds.push(newCmd)

        var newCmdLogs = {
            logs: []
        };

        var _logs = newCmdLogs.logs; 
        var functionToUpdateCmd = (window.cmdUpdate || function(){console.log(newCmdLogs)});
        // var lastStdOut = (_logs[_logs.length-1] || '') + '> ' + msg; _logs[_logs.length-1] = lastStdOut
        var _write = function (msg) {console.log('WRITE GOT CALLED========='); newCmd.stdin.write(msg + '\n'); functionToUpdateCmd()}

        newCmd.stdout.on('data', function (data) {
            _logs.push(data.toString());

            // if(isFirstOut) {
            //     _logs.push(currentLocation);
            //     isFirstOut = false;
            // }

            functionToUpdateCmd();
        });
          
        newCmd.stderr.on('data', function (data) {
            _logs.push(data.toString());
            
            functionToUpdateCmd()
        });

        newCmdLogs.write = _write;
        window.terminals.push(newCmdLogs);
    }

    function _remove (index) {
        _cmds[index].kill();
        _cmds.splice(index, 1);
    }

    function _cleanAll () {
        _cmds.forEach(function(_cmd) {
            try {
                _cmd.kill();
            } catch (e) {
                console.log(e);
            }
        })
    }

    return {
        remove: _remove,
        add: _add,
        cleanAll: _cleanAll
    }
})()

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
        changeTheme: () => {
    
            let inactiveColor = themeUtils.isDark ? " rgb(133, 133, 133)" : "black";
            let activeColor = themeUtils.isDark ? "white" : "black";
    
            const root = document.documentElement;
            root.style.setProperty("--sidebar-inactive-icon", inactiveColor);
            root.style.setProperty("--sidebar-active-icon", activeColor);
            
            let iconsPath = themeUtils.iconsPath();
    
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
                root.style.setProperty(`--${iconName}-icon`, `url('${iconsPath}/${iconName}.svg') no-repeat center`)
            });
    
            let colorVariablesMapping = {
                '--primary-dark-bg': '#181818',
                '--primary-light-bg': '#1f1f1f',
                '--primary-light2-bg': '#adaeae',
                '--primary-light3-bg': '#444444',
                '--directory-rename-bg': '#313131',
                '--outline-color': '#0078d4',
                '--base-text-color': '#cccccc',
                '--base-text-color-80': '#cccccccc',
                '--base-text-color-60': '#cccccc99',
                '--base-text-color-40': '#cccccc66',
                '--base-border-color': '#2b2b2b',
                '--secondary-border-color': '#454545',
                '--icon-hover-bg': '#2d2e2e',
                '--tooltip-bg': '#202020',
                '--item-select-bg': '#04395e',
                '--gray-out-selection': '#37373d',
                '--error-border-color': '#bd1100',
                '--tree-line': '#313131',
                '--focused-tree-line': '#585858',
                '--file-hover-unselected': 'rgba(60, 66, 68, 0.35)',
                '--file-search-bg': '#222222',
                '--file-search-hover-bg': '#2a2d2e',
                '--file-search-sections-labels-color': '#3794ff',
                '--file-search-subtext-color': '#999999',
                '--file-search-marker-color': '#2aaaff',
                '--timeline-tip-color': '#717171'
            };
    
            let colorVariables = Object.keys(colorVariablesMapping);
    
            colorVariables.forEach((varName) => {
                root.style.setProperty(varName, colorVariablesMapping[varName]);
            })
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
        variables: {
            bg: {
                primaryDark: 'var(--primary-dark-bg)'
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

const nwWindow = nw.Window.get();

window.screenControls = {
    nwWindow: nwWindow,
    isFullScreen: () => {
        return nwWindow.height >= window.screen.availHeight && nwWindow.width >= window.screen.availWidth;
    },
}

let windowSizeEvents = [
    'restore',
    'maximize',
    'resize'
];

windowSizeEvents.forEach((evName) => {
    // IN ORDER FOR THIS TO BREAK, BECAUSE OF A NW BUG, YOU SHOULDN'T REFRESH USING F5, BUT RIGHT CLICK => `Reload App`
    nwWindow.on(evName, () => {
        let newEv = new Event('nw_custom_resize');

        document.dispatchEvent(newEv);
    })
})

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

    let XPSafeNewDirectory = `"${newDirectory}"`;

    if(launchArgumentExists) {
      newLaunchArguments[newLaunchArguments.length-1] = XPSafeNewDirectory;
    } else {
      newLaunchArguments.push(XPSafeNewDirectory);
    }

    let XPSafeNWPath = `"${nw.process.execPath}"`;
    // // Relaunch the app with new arguments 
    const commandToExecute = `${XPSafeNWPath} . ${newLaunchArguments.join(" ")}`;
    console.log(commandToExecute);

    child_process.exec(commandToExecute, (err, stdout, stderr) => {
        if (err) {
            console.error('Failed to relaunch the app:', err);
        }

        console.log({
            err,
            stdout,
            stderr
        })
    });
    
    if(shouldQuit) {
        nw.App.quit();
    }
}

// var readline = require('readline');
// var spawn = child_process.spawn;

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// var shell = process.platform === 'cmd.exe';
// var shellArgs = process.platform === 'win32' ? [] : ['-c', ''];

// var child = spawn(shell, shellArgs, {
//   stdio: 'pipe'
// });

// child.stdout.on('data', function (data) {
// //   process.stdout.write(data.toString());
//   console.log(data, 'stdout');
// });

// child.stderr.on('data', function (data) {
// //   process.stderr.write(data.toString());
//   console.log(data, 'stderr');

// });

// child.on('close', function (code) {
//   console.log('Shell closed with code ' + code);
//   process.exit(code);
// });

// rl.on('line', function (input) {
//   child.stdin.write(input + '\n');
// });

// rl.on('SIGINT', function () {
//   child.kill('SIGINT');
//   rl.close();
// });
