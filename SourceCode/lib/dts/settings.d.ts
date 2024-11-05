type settings = {
    get: () => any;
    set: (newSettings: any) => void;
    section: {
        get: (sectionName: any) => any;
        set: (sectionName: any, sectionData: any) => void;
    };
    update: () => void;
};

declare const settings: settings;