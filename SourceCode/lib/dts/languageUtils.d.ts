type PythonLanguageToken = {
    type: number,
    channel: number,
    start: number,
    stop: number,
    tokenIndex: number,
    line: number,
    column: number,
    text: string
}

type OutlineItemFunctions = {
    select(value: boolean): void,
    hover(value: boolean): void
}

type outline = {
    getOutline: (full_path: any) => any,
    grayedOut: boolean,
    selectedItem: {
        get: () => any,
        set: (newValue: any) => void
    },
    hoveredItem: {
        get: () => any,
        set: (newValue: any) => void
    },
    itemEvents: {[key: number]: OutlineItemFunctions},
    expansion: {}
}

declare const outline: outline;