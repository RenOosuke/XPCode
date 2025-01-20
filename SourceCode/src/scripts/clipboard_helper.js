{
    window.clipboardHelper = (() => {
        const { spawn } = child_process;
        const PROGRAM_CONSTS = {
            CLIPBOARD_TYPE: 'Clipboard Type: ',
            END: `___end___\u000d`,
        };

        let clipboardPath = path.resolve(`${EXECUTABLES_PATH}\\clipboard_helper.exe`); //clipboard_helper

        const parsePaths = (arr) => arr.join('::');

        const buildCommandLine = (command, commandParameters) => {
            switch (command) {
                case 'check':
                    return 'check';
                case 'copy':
                    return `copy_files ${parsePaths(commandParameters.files)}`;
                case 'cut':
                    return `cut_files ${parsePaths(commandParameters.files)}`;
                case 'paste':
                    return `paste_files ${parsePaths(commandParameters.files)}`;
                default:
                    throw new Error('Unsupported command');
            }
        };

        const sendCommand = (command, commandParameters) => {
            return new Promise((resolve, reject) => {
                const clipboardHelper = spawn(clipboardPath, [], {
                    detached: false,
                    stdio: ['pipe', 'pipe', 'pipe'],
                });

                let resolveCurrentCommand = resolve;

                let fullCommand = '';

                switch(command) {
                    case 'check':
                        resolveCurrentCommand = (fullResponse) => {
                            let newLines = fullResponse.split('\n');
                            clipboardType = newLines[0].split(PROGRAM_CONSTS.CLIPBOARD_TYPE)[1].trim();
                            let content = newLines.slice(1, newLines.length).join('\n').split('\u000d').slice(0, -1).join('\n');

                            switch(clipboardType) {
                                case 'file':
                                    let pathsInClipboard = content.split('\n').filter(_path => _path.length>0);
                                    content = pathsInClipboard
                                break;

                                case 'image':
                                break;
                            }

                            resolve({
                                contentType: clipboardType,
                                content
                            });
                        }

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

                            // const filesToCopy = parsePaths(commandParameters.files);

                            // _clipboardHelper.stdin.write(`copy_files ${filesToCopy}\n`);
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

                            // const filesToCut = parsePaths(commandParameters.files);
                            // _clipboardHelper.stdin.write(`cut_files ${filesToCut}\n`);
                        }
                        break;

                    case 'paste':
                        if (commandParameters.file_explorer) {
                            resolveCurrentCommand = (fullResponse) => {
                                // if(fullResponse.length == 0) {
                                    
                                //     file_explorer.cutPaths = commandParameters.files;
                                //     shortcuts.rerenderSelected()

                                //     resolve({
                                //         action: 'cut',
                                //         success: true,
                                //         files: commandParameters.files
                                //     })
                                // } else {
                                //     throw new Error(`Unhandled case: length (${fullResponse.length}) content (${fullResponse})`)
                                // }
                                console.log(fullResponse)
                                resolve(fullResponse)
                            }

                            // const destinationToPaste = parsePaths(commandParameters.files);
                            // _clipboardHelper.stdin.write(`paste_files ${destinationToPaste}\n`);
                        }
                        break;
                }
                
                clipboardHelper.stdout.on('data', (data) => {
                    let commandOutput = data.toString();
                    if (fullCommand.length > 0) {
                        commandOutput = fullCommand + commandOutput;
                    }

                    let lines = commandOutput.split('\n');
                    let lastLine = lines[lines.length - 2] || ''; // Second last line
                    let isFullResponse = lastLine === PROGRAM_CONSTS.END;

                    if (isFullResponse) {
                        lines = lines.slice(0, -2); // Remove "___end___"
                        resolveCurrentCommand(lines.join('\n'));
                        fullCommand = '';
                        clipboardHelper.kill(); // Close the process once resolved
                    } else {
                        fullCommand += commandOutput;
                    }
                });

                clipboardHelper.stderr.on('data', (data) => {
                    reject(data.toString());
                    clipboardHelper.kill(); // Ensure the process is terminated on error
                });

                clipboardHelper.on('error', (error) => {
                    reject(error);
                    clipboardHelper.kill(); // Terminate the process if it fails
                });

                clipboardHelper.on('close', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Clipboard helper exited with code ${code}`));
                    }
                });

                // Send the command to the clipboard helper
                try {
                    const commandLine = buildCommandLine(command, commandParameters);
                    clipboardHelper.stdin.write(`${commandLine}\n`);
                } catch (error) {
                    reject(error);
                    clipboardHelper.kill(); // Terminate process on write error
                }
            });
        };

        return {
            parsePaths,
            sendCommand
        };
    })();
}
