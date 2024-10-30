type chokidarCases = 'File created' | 'File deleted' | 'Directory created' | 'Directory deleted' | 'File modified';

type xp_chokidar = {
    on(chokidarCase: chokidarCases, cb: Function): void
    watch(path: PathLike): void,
    unwatch(chokidarCase: chokidarCases): void
}

declare var xp_chokidar: xp_chokidar;