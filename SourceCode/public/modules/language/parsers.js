window.parsers = {
    js: () => {
        return new Promise((res, rej) => {
            res(require('esprima'))
        })
    },
    py: () => {
        return new Promise((res, rej) => {
            let execPath = path.resolve('public\\modules\\executables\\python_version_check.exe')
            child_process.exec(execPath, (err, stdout, stderr) => {
                let dt_python_parser = require('dt-python-parser')
                let versions = {
                    2: dt_python_parser.Python2Parser,
                    3: dt_python_parser.Python3Parser
                };

                if(stdout) {
                    let commandResult = stdout;
                    const unnecessaryString = "Python Version Output: Python ";
                
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
                                res(pythonParser);
                            }
                    } else {
                        res(versions[3]);
                    }
                } else {
                    res(versions[3]);
                }
            });
        })
    }
}