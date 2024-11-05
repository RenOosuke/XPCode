{
    window.clipboardHelper = (() => {
        const { spawn } = child_process;
        const PROGRAM_CONSTS = {
            CLIPBOARD_TYPE: 'Clipboard Type: ',
            END: `___end___\u000d`,
        };

        let clipboardPath = path.resolve('public\\modules\\executables\\clipboard_helper.exe');

        const _clipboardHelper = spawn(clipboardPath, [], {
            detached: true,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        const parsePaths = (arr) => {
            return arr.join('::');
        }

        // _clipboardHelper.stdout.on('data', (data) => {
        //     console.log(`Output: ${data.toString()}`);
        //   });

        const stopWatching = () => {
            console.log('CLOSING OFF')
            sendCommand('exit');
            _clipboardHelper.unref();

            try {
                _clipboardHelper.kill()
            } catch(e) {

            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', stopWatching);
        }

        function sendCommand(command, commandParameters) {
            let tempSub;

            return new Promise((res, rej) => {
                let wrappedResolve = (_data) => {
                    if(tempSub) {
                        tempSub.destroy();
                    }

                    res(_data);
                }

                let wrappedReject = (reason) => {
                    rej(reason);
                }

                // res('LOL');
                let getIsFull = (lines) => {
                    let lastLine = (lines[lines.length-2] || "");
                    return lastLine == PROGRAM_CONSTS.END;
                };

                switch(command){
                    case 'check': 
                        _clipboardHelper.stdin.write(`${command}\n`);
                        let outputs = 0;

                        let clipboardType;
                        let clipboardContent = '';

                        tempSub = _clipboardHelper.stdout.on('data', (data) => {
                            let clipboardContains = data.toString();
                            let newLines = clipboardContains.split('\n');

                            if(outputs == 0) {
                                clipboardType = newLines[0].split(PROGRAM_CONSTS.CLIPBOARD_TYPE)[1].trim();
                                newLines = newLines.slice(1, newLines.length);
                            }

                            let isFull = getIsFull(newLines);

                            if(isFull) {
                                newLines = newLines.slice(0, newLines.length-2);
                            }

                            clipboardContent += (clipboardContent.length>0 ? '\n' : '') + newLines.join('\n');

                            if(isFull) {
                                wrappedResolve({
                                    clipboardType,
                                    clipboardContent
                                })
                            }
                            outputs++;
                        });
                    case 'copy':
                        if(commandParameters.file_explorer) {
                            let filesToCopy = parsePaths(commandParameters.files);

                            _clipboardHelper.stdin.write(`copy_files ${filesToCopy}\n`);

                            tempSub = _clipboardHelper.stdout.on('data', (data) => {
                                let commandResults = data.toString();
                                let newLines = commandResults.split('\n'); 
                                let isFull = getIsFull(newLines);

                                if(isFull) {
                                    wrappedResolve({
                                        success: true,
                                        copiedFiles: commandParameters.files
                                    })
                                }
                            });
                        }
                    break;

                    case 'cut':
                        if(commandParameters.file_explorer) {
                            let filesToCopy = parsePaths(commandParameters.files);

                            _clipboardHelper.stdin.write(`cut_files ${filesToCopy}\n`);

                            tempSub = _clipboardHelper.stdout.on('data', (data) => {
                                let commandResults = data.toString();
                                let newLines = commandResults.split('\n'); 
                                let isFull = getIsFull(newLines);

                                if(isFull) {
                                    wrappedResolve({
                                        success: true,
                                        copiedFiles: commandParameters.files
                                    })
                                }
                            });
                        }
                    break;
                }
            })
        }

            _clipboardHelper.on('close', (code) => {
            console.log(`Clipboard helper exited with code ${code}`);
          });
          

        // console.log()
        return {
            parsePaths,
            sendCommand
        }
    })()
}

// setTimeout(() => {
//     clipboardHelper.sendCommand('check').then(a => console.log(a));
// }, 3000)