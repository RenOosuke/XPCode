type SCRIPTNAME1 = "directory"
type scriptNames = SCRIPTNAME1;

type scriptReturns = {
    directory: {
        directory: string
    }
}

type getScript = <s extends scriptNames>(scriptName: s) => scriptReturns[s];
// declare namespace SriptUtils{
//     function getScript 
// }

type credentials = {
    get(key: string): string,
    getConfig(): object,
    remove(key: string): void,
    set(key: string, value: any): void,
    update(key: string, newData: any): void  
}

declare var credentials: credentials;

declare var omit: (obj: object, keys: string[]) => object

declare var scripts: {}

type ignoredJSONObj = {per_path: {}, all: string[], by_name: {}, by_ext: {}, by_file_path: {}}

type singleFolderItem = {isFolder: boolean; full_path: string; isStaging: boolean; new: boolean; name: string;}; 

type file_explorer = {
   getFilesInDirectory: (dirPath: any) => Promise<any>;
   rescan(): void;
   sortDirectories(path: PathLike): singleFolderItem[];
   cancelStaging(): void;
   tree: {
    
   },
   chokidarUpdate: (filePath: any, isFolder: any, isCreating: any) => void;
   selectedItems: PathLike[],
   hoveredItem: PathLike | undefined,
   hoverListeners: number,
   grayedOut: boolean;
   staging: {
    oldName: PathLike,
    newName: PathLike
   }
}

declare var file_explorer: file_explorer;

declare var SelectionBox: {
    show: (startCorner: MouseEvent) => void;
    hide: () => void;
    drag: (newCorner: MouseEvent) => void;
    drop: () => void;
    endCorner: MouseEvent;
    startCorner: MouseEvent;
    position: number[];
    size: number[];
    shouldShow: boolean;
    setXOffset: (xOffset: any) => void;
    setYOffset: (yOffset: any) => void;
    xOffset: number;
    yOffset: number;
    rerender: () => void;
}

declare var StringUtils: {
    cleanFrom: (str: any, symbolsToClean: string[]) => void;   
}

declare var mime: (directory: string) => string

interface ExecException extends Error {
    cmd?: string;
    killed?: boolean;
    code?: number;
    signal?: NodeJS.Signals;
}


declare function fastFolderSize(
    path: string,
    callback: (err: ExecException | null, bytes?: number) => void
  ): child_process.ChildProcess


type sizePath = {
    path: string,
    size: number
}

type sizePaths = sizePath[];

declare var SizeUtils: {
    fastFolderAsync: (_path: any) => Promise<number>,
    pathsSize: (_paths: any) => Promise<sizePaths>,
    getSizeStringFromBytes: (size: number, fixed: number) => string
}

type notification_types = 'normal' | 'progress';

declare let notify: (message: string, { duration, type: notification_types, continuous }: {
    duration: any;
    type?: string;
    continuous?: {
        messageId: string, 
        progress: number
    };
}) => (message: string, { progress: number, duration }: {
    progress: number;
    duration: number;
}) => void

type x1 = number;
type x2 = number;
type y1 = number;
type y2 = number;

type topLeft = [x1, y1];
type topRight = [x2, y1];
type bottomRight = [x2, y2];
type bottomLeft = [x1, y2];

type elementCorners = [topLeft, topRight, bottomLeft, bottomRight];

type cleanSubscription = ({ element, elementName, eventName, func, functionName }: {
    element: any;
    elementName: any;
    eventName: any;
    func: any;
    functionName: any;
}) => void;


type _addEventListener = <K extends keyof DocumentEventMap>(element: HTMLElement, type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions) => void;
type addEventListener2 = (element: HTMLElement, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
type addCustomEventListener = _addEventListener | addEventListener2;

declare var ElementUtils: {
    parseRems(el: HTMLElement, prop: any): number;
    getCalculatedHeightRems(elSelector: any, include: {top: boolean, bottom: boolean}): any;
    getCalculatedWidthRems(elSelector: any, include: {left: boolean, right: boolean}): any;

    dotIsInside(parentCoords: elementCorners, dotCoords: [x: number, y: number], {onlyBorder: boolean, offset: number}): boolean;
    isInsideOf(parentEl: HTMLElement, childEl: HTMLElement, {offset: number, onlyBorder: boolean}): boolean;
    areOverlapping(parentEl: HTMLElement, childEl: HTMLElement): boolean,
    mouse: MouseEvent | undefined,
    eventCleanUpUtil: () => {
        clean: () => void;
        customEventListener: addCustomEventListener
    },
    generateId: () => string
}

declare var _addEventListener: addCustomEventListener;

type singleMenuItem = {
    label: string,
    name: string,
    disabled?: boolean,
    click?: () => void,
    options?: singleMenuItem[],
    separator: true,
}

type Menu = {
    zIndex?: number;
    options: singleMenuItem[];
    // hide: function;
    additionalStyle?: {};
    isLeftSide?: boolean;
    x?: number;
    y?: number;
}

declare var menu: (config: Menu) => void;

type FormProps = {
    zIndex: number,
    PopupComponent: any,
    showBorders: boolean,
    toggleSize: Function,
    draggable: boolean,
    relative: boolean,
    additionalProps: {
        title?: string,
        passedAdditionalProps?: object
    },
    // cancel: Function,
    // submit: Function,
    // hide: ,
    height: string,
    width: string,
    xp: boolean,
    x: number,
    y: number;
}
type rejectReason = string;
type submitResult <expectedResult>= {
    /** @type {expectedResult} */
    result: {
        [key in keyof expectedResult]: expectedResult[key];
    }
    // {
    //     // [_key extends keyof expectedResult]: typeof expectedResult[_key]
    // }
}

type passwordPromptOptions = {
    newPassword: undefined | string; oldPassword: string
}

type singleExcelTab = {
    name: string;
    fields: string[];
    records: {}[];
};

type popups = {
    instanceManager: (instanceConfig: {
        choice: boolean, hide_source: boolean
    }) => Promise<rejectReason | submitResult<string>>;

    simpleChoice(choiceConfig?: {
        isTable: boolean, rows?: object[], title: string, height?: string, width?: string
    }): Promise<string | submitResult<{row_id: string}>>;

    simpleChoice(choiceConfig?: {
        isTable: boolean, rows?: object[], multi: boolean, title: string, height?: string, width?: string
    }): Promise<string | submitResult<{row_id: string}[]>>;

    passwordPrompt: () => Promise<rejectReason | submitResult<passwordPromptOptions>>,

    opsrampCookie: () => Promise<rejectReason | submitResult<{_uaid: string; _cookie: string;}>>,

     forms: {
        tables: {
            generalExcel: (tabs: singleExcelTab[]) => Promise<string | submitResult<any>>;
        };
        treeView: {
            opsramp: (title: any, node: any, meta: any) => any;
        };
    }
}

type progressProps = {
    zIndex: number,
    additionalProps: {

    },
    relative: boolean,
    progress: number,
    done: boolean,
    showBorders: boolean,
    /** @description Milliseconds duration to disperse the notification after it's done, pass null if it doesn't have auto.*/
    timer: number,
    message: string,
    //   draggable,
    width: string,
    xp: boolean,
    x: number,
    y: number;
}

declare var popups: popups;
declare var form: <resultType>(formProps: FormProps) => Promise<rejectReason | submitResult<resultType>>;

type progressUpdate = ({/** @description a float between 0 and 1*/progress: number, done: boolean, message: string}) => void;
declare var progress: (formProps: FormProps) => Promise<({/** @description a float between 0 and 1*/progress: number, done: boolean, message: string}) => void | rejectReason>;

declare const IS_DEVELOPER_MODE: () => boolean;
declare const IS_XP_ON: () => boolean;

declare const spinner:  {
    setLoading: (loadingVal: any) => void;
    setTimer: (timeMs: any) => void;
}

declare const loading: (loadingVal: any) => void;
// declare const jQuery: JQuery