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

        let chokidarPath = path.resolve('public\\modules\\executables\\xp_chokidar.exe');

        let directoryWatcher = (pathToExec) => {
            const watcherProcess = spawn(chokidarPath, [pathToExec]);

            watcherProcess.stdout.on('data', (data) => {
                let outputLines = data.toString().split('\u000d\n').filter(a => a.length > 0);

                outputLines.forEach((line) => {
                    cachedWatchers.event(line);
                });
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
                window.addEventListener('beforeunload', stopWatching);
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
