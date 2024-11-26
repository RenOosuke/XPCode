type settings = {
    get: () => any;
    set: (newSettings: any) => void;
    section: {
        get: (sectionName: SettingsPaths) => any;
        set: (sectionName: SettingsPaths, sectionData: any) => void;
    };
    update: () => void;
};

type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}.${P}`
        : never
    : never;

type Paths<T> = T extends object
    ? {
          [K in keyof T]: K extends string
              ? T[K] extends object
                  ? K | Join<K, Paths<T[K]>>
                  : K
              : never;
      }[keyof T]
    : never;

type SettingsPaths = Paths<defaultSettings>;

type defaultSettings = {
    explorer_tabs: {
        show: {
            files: {
                timeline: true,
                outline: true,
                open_editors: true,
                folders: true,
                npm_scripts: true,
            },
            git: {

            },
            debug: {

            }
        },
        outline: {
            sort: "sort_outline_by_position"
        },
    },

    shortcuts: {
        file_explorer: {
            rename: "F2",
            delete: "Delete",
            new_file: "Win__n",
            new_folder: "Win__Alt__n",
            reveal_in_file_explorer: "Shift__Alt__r",
            copy: "Ctrl__c",
            cut: "Ctrl__x",
            paste: "Ctrl__v",
        },
        general: {
            search_by_file_name: "Ctrl__p",
            command_palette: "Ctrl__Shift__p",
            settings: "Ctrl__,",
            shortcuts: "Ctrl__k__s",
            color_theme: "Ctrl__k__t"
        },
        sidebar: {

        }
    },

    variables: {
        explorer: {
            x_offset: '0px'
        }
    },

    temporary: {
        recent: {
            folders: [],
            files: [],
        }
    }
}

declare const settings: settings;