
window.WindowManager = (() => {
    let windows = {

    };

    const defaultNWWindowFunction = () => {
        alert("This is a function you should not be able to see.");

        return false;
    }
    
    let windowPromptQuit = defaultNWWindowFunction;

    let nwWindow = {
        minimize: defaultNWWindowFunction,
        maximize: defaultNWWindowFunction,
        unmaximize: defaultNWWindowFunction,
    };

    let lastWindowSetting = {};
    let isMaximizing = false;

    const saveLastWindowSettings = () => {
        lastWindowSetting.width = nwWindow.width;
        lastWindowSetting.height = nwWindow.height;
        lastWindowSetting.y = nwWindow.y;
        lastWindowSetting.x = nwWindow.x;
    }

    if(!window.isSubwindow) {
        nwWindow = nw.Window.get();
        
        windowPromptQuit = () => {
            let hasUnsavedFiles = false; // TODO
        
            if(!hasUnsavedFiles) {
                nw.App.quit();
            }
        }
    
        const windowResizeEvents = 
        [                   
            'restore',
            'maximize',
            'resize',
        ];
        
        windowResizeEvents.forEach((evName) => {
            // IN ORDER FOR THIS TO BREAK, BECAUSE OF A NW BUG, YOU SHOULDN'T REFRESH USING F5, BUT RIGHT CLICK => `Reload App`
            nwWindow.on(evName, () => {
                let newEv = new Event('nw_custom_resize');
        
                document.dispatchEvent(newEv);
            })
        })
    }

    return {
        isFullScreen: () => {
            return nwWindow.height >= window.screen.availHeight && nwWindow.width >= window.screen.availWidth;
        },

        minimize: () => nwWindow.minimize(),
        maximize: () => {
            // if(!window.isSubwindow && APP_WINDOW.aero) {
            //     isMaximizing = true;
            //     saveLastWindowSettings();
            //     nwWindow.width = screen.width;  
            //     nwWindow.height = screen.height;
            //     nwWindow.y = screen.availTop;
            //     nwWindow.x = screen.availLeft;
            // } else {
            // }
            nwWindow.maximize();
        },
        unmaximize: () => {
            // if(!window.isSubwindow && APP_WINDOW.aero) {
            //   nwWindow.width = lastWindowSetting.width;
            //   nwWindow.height = lastWindowSetting.height;
            //   nwWindow.y = lastWindowSetting.y;
            //   nwWindow.x = lastWindowSetting.x;
            // } else {
            // }
            nwWindow.unmaximize();
        } ,
        windowPromptQuit,
    }
})()