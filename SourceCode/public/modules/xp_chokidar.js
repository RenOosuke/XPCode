{
    window.xp_chokidar = (() => {
        const { spawn } = child_process;

        let cachedWatchers = (() => {
            let _cases = {
                "File created": [],
                "File deleted": [],
                "Directory created": [],
                "Directory deleted": [],
                "File modified": [],
                "Finished logging existing paths": [
                    () => {
                        file_explorer.refreshTime = 1
                    }
                ]
            };

            let _on = (/**@type {chokidarCases} */ chokidarCase, cb) => {
                (_cases[chokidarCase] || []).push(cb);
            };

            let chokidarEvent = (/** @type {string}*/ _event) => {
                
                let [eventCase, eventPath] = _event.split(": ");
                
                let funcs = _cases[eventCase];

                if(funcs) {
                    funcs.forEach((subscribedFunction) => {
                        // console.log(eventPath);
                        subscribedFunction(eventPath);
                    });
                }
            };

            return {
                on: _on,
                unwatch: (/**@type {chokidarCases} */ chokidarCase) => {
                    _cases[chokidarCase] = [];
                },
                event: chokidarEvent
            };
        })();

        let chokidarPath = path.resolve(`${EXECUTABLES_PATH}\\xp_chokidar.exe`);

        let directoryWatcher = (pathToExec) => {
            const watcherProcess = spawn(chokidarPath, [pathToExec]);

            watcherProcess.stdout.on('data', (data) => {
                let outputLines = data.toString().split('\u000d\n');
                outputLines = outputLines.filter(a => a.length > 0);

                let i = 0;

                for (i = 0; i < outputLines.length; i++) {
                    try {
                        cachedWatchers.event(outputLines[i]);
                    } catch (err) {
                        console.error(`Error processing line: "${outputLines[i]}"`, err);
                    }
                }
            });

            watcherProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data.toString()}`);
            });

            watcherProcess.on('close', (code) => {
                console.log(`Child process exited with code ${code}`);
            });

            const stopWatching = () => {
                if (watcherProcess) {
                    watcherProcess.kill();
                    watcherProcess = null;
                    console.log('Watcher process terminated.');
                }
            }

            if (typeof window !== 'undefined') {
                processessCleanQueue.push(stopWatching)
            }

            return watcherProcess;
        };

        return {
            on: cachedWatchers.on,
            watch: directoryWatcher,
            unwatch: cachedWatchers.unwatch
        };
    })();
}
