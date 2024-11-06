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

        const parsePaths = (arr) => arr.join('::');

        const stopWatching = () => {
            console.log('CLOSING OFF');
            sendCommand('exit');
            _clipboardHelper.unref();

            try {
                _clipboardHelper.kill();
            } catch (e) {}
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', stopWatching);
        }

        let resolveCurrentCommand = null;
        let rejectCurrentCommand = null;

        // Set up a single stdout listener to handle all command responses
        _clipboardHelper.stdout.on('data', (data) => {
            if (!resolveCurrentCommand) {
                // console.log(data.toString());
                return; // No active command to resolve
            }

            let commandOutput = data.toString();
            let lines = commandOutput.split('\n');
            let lastLine = lines[lines.length - 2] || ""; // Second last line due to potential trailing newline
            let isFullResponse = lastLine === PROGRAM_CONSTS.END;

            if (isFullResponse) {
                lines = lines.slice(0, -2); // Remove the "___end___" marker from the output
                let fullResponse = lines.join('\n');
                resolveCurrentCommand(fullResponse); // Resolve the promise with the response
                resolveCurrentCommand = null; // Clear current command handler
            }
        });

        _clipboardHelper.stderr.on('data', (data)=> {
            if(!rejectCurrentCommand) {
                return
            }

            let err = data.toString();
            rejectCurrentCommand(err);
        })

        const sendCommand = (command, commandParameters) => {
            return new Promise((resolve, reject) => {
                rejectCurrentCommand = reject;

                switch (command) {
                    case 'check':
                        resolveCurrentCommand = (fullResponse) => {
                            let newLines = fullResponse.split('\n');
                            clipboardType = newLines[0].split(PROGRAM_CONSTS.CLIPBOARD_TYPE)[1].trim();
                            let content = newLines.slice(1, newLines.length).join('\n').split('\u000d').slice(0, -1).join('\n');

                            resolve({
                                contentType: clipboardType,
                                content
                            });
                        }

                        _clipboardHelper.stdin.write(`${command}\n`);
                        break;

                    case 'copy':
                        if (commandParameters.file_explorer) {

                            resolveCurrentCommand = (fullResponse) => {
                                if(fullResponse.length == 0) {

                                    file_explorer.cutPaths = []
                                    shortcuts.rerenderSelected()

                                    resolve({
                                        action: 'copy',
                                        success: true,
                                        files: commandParameters.files
                                    })
                                } else {
                                    throw new Error(`Unhandled case: length (${fullResponse.length}) content (${fullResponse})`)
                                }
                            }

                            const filesToCopy = parsePaths(commandParameters.files);

                            _clipboardHelper.stdin.write(`copy_files ${filesToCopy}\n`);
                        }
                        break;

                    case 'cut':
                        if (commandParameters.file_explorer) {
                            resolveCurrentCommand = (fullResponse) => {
                                if(fullResponse.length == 0) {
                                    
                                    file_explorer.cutPaths = commandParameters.files;
                                    shortcuts.rerenderSelected()

                                    resolve({
                                        action: 'cut',
                                        success: true,
                                        files: commandParameters.files
                                    })
                                } else {
                                    throw new Error(`Unhandled case: length (${fullResponse.length}) content (${fullResponse})`)
                                }
                            }

                            const filesToCut = parsePaths(commandParameters.files);
                            _clipboardHelper.stdin.write(`cut_files ${filesToCut}\n`);
                        }
                        break;

                    default:
                        reject(new Error("Unsupported command."));
                        resolveCurrentCommand = null; // Clear handler on unsupported command
                        break;
                }
            });
        };

        _clipboardHelper.on('close', (code) => {
            console.log(`Clipboard helper exited with code ${code}`);
        });

        return {
            parsePaths,
            sendCommand
        };
    })();
}


// setTimeout(() => {
//     clipboardHelper.sendCommand('check').then((a) => {
//         console.log(a)

//         // clipboardHelper.sendCommand('check').then(b => console.log(b));
//     });
// }, 3000)