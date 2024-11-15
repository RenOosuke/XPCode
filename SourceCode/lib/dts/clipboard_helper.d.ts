type ClipboardHelper = {
    parsePaths: (arr: any) => any;
    sendCommand: (command: any, commandParameters: any) => Promise<any>
}

declare const clipboardHelper: ClipboardHelper