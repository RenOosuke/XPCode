declare var checkDisk: (driveName) => Promise<{
    diskpath: string, free: number, size: number
}>

type customFunctions = {
    escapePattern: (...args: any[]) => string
    arrayToObject: (arr: string[]) => {};
    onlyUnique(value: any, index: any, array: any): boolean;
    sortByCustomOrder: (columns: string[] ,orderForNecessaryColumns: string[], records: object[], orderByPopulationToo: boolean) => string[]
}

declare var customFunctions: customFunctions

type timeUtils = {
    convert: (dateObj: Date) => {
        milliseconds: number;
        seconds: number;
        minutes: number;
        hours: number;
        days: number;
    }
};

declare var timeUtils: timeUtils;
declare var appDir: string;