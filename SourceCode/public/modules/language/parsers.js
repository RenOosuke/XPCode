window.parsers = {
    js: () => {
        return require('esprima')
    },
    py: () => {
        let execPath = path.resolve('public\\modules\\executables\\python_version_check.exe')
        let versionCheckCommand = child_process.execSync(execPath);
        let commandResult = versionCheckCommand.toString();
        const unnecessaryString = "Python Version Output: Python ";
    
        let dt_python_parser = require('dt-python-parser')
        
        let versions = {
            2: dt_python_parser.Python2Parser,
            3: dt_python_parser.Python3Parser
        };
    
        console.log(dt_python_parser.Python3Parser);
        
        if(commandResult.indexOf(unnecessaryString) == 0) {
                let pythonVersion = undefined;
    
                let rawVersion = commandResult.split(unnecessaryString).join("");
    
                if(rawVersion.indexOf("3.") == 0) {
                    pythonVersion = 3;
                } else {
                    pythonVersion = 2;
                };
    
                if(pythonVersion == 3 || pythonVersion == 2) {
                    let pythonParser = versions[pythonVersion];
                    return pythonParser;
                }
        } else {
            return versions[3];
        }
    }
}