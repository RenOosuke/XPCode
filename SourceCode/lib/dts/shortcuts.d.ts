type shortcuts = {
    getVisibleElements: () => HTMLElement[];
    pause: () => void;
    start: () => void;
    rerenderSelected: (shouldExpand: any) => boolean;
}

declare const shortcuts: shortcuts;