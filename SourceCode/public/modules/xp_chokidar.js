{
    window.xp_chokidar = (() => {
        const path = require('path');
        const { spawn } = require('child_process');

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
                        console.log("======changed the refresh time ====================================")
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

        let chokidarPath = path.resolve('public\\modules\\chokidar\\xp_chokidar.exe');

        let directoryWatcher = (pathToExec) => {
            const watcherProcess = spawn(chokidarPath, [pathToExec]);

            watcherProcess.stdout.on('data', (data) => {
                const outputLines = data.toString().split('\n');

                outputLines.forEach((line) => {
                    cachedWatchers.event(line.trim());
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
