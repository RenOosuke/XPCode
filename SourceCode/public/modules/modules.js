window.timeA = new Date().getTime();

window.fs = require("fs");
window.path = require('path');
window.chokidar = require('chokidar');

window.launchArguments = nw.__dirname; // nw.App.fullArgv;

window.directory = path.basename(launchArguments);
console.log('Launch arguments - ', launchArguments);

window._i = function (template, values) {
    return template.replace(/\$\{(\d+)\}/g, function(match, index) {
        return typeof values[index] !== 'undefined' ? values[index] : match;
    });
}

window.child_process = require('child_process');

console.log(child_process.exec('cmd', function(err, stdout, stderr){
    console.l(stdout);
}));

// child_process.exec('start cmd /K', function(err, stdout, stderr) {
//     console.log(stdout);
// })

child_process.spawn('C:\\Windows\\System32\\cmd.exe', {
    shell: true,
    stdio: 'pipe'
})

console.log(window.session);
window.setTheme = function(themeName) {
    var foldersElement =  $('#explorer')[0];
    var oldClasses = [];

    // foldersElement.className = foldersElement.className.split(' ').filter(function(clsname) {return clsname.indexOf('ace')<0}).join(' ') + '  ace-' + themeName;

    vscode.setTheme(_i("ace/theme/${0}", [themeName]));
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
        return spread(spread(objs.splice(0, 2)), objs);
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
            'chevron-up'
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
            '--base-text-color': '#cccccc'
        };

        let colorVariables = Object.keys(colorVariablesMapping);

        colorVariables.forEach((varName) => {
            root.style.setProperty(varName, colorVariablesMapping[varName]);
        })
    },

    variables: {
        bg: {
            primaryDark: 'var(--primary-dark-bg)'
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
