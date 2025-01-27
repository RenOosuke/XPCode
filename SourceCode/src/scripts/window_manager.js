
const WindowManager = (() => {

    let isMaximized = false;

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
            RESTORE,
            MAXIMIZE,
            RESIZE,
            UNMAXIMIZE
        ];
        
        windowResizeEvents.forEach((evName) => {
            // IN ORDER FOR THIS TO BREAK, BECAUSE OF A NW BUG, YOU SHOULDN'T REFRESH USING F5, BUT RIGHT CLICK => `Reload App`
            nwWindow.on(evName, () => {
                if(evName == MAXIMIZE) {
                    isMaximized = true;
                } 

                if(evName == UNMAXIMIZE) {
                    isMaximized = false;
                }

                let newEv = new Event('nw_custom_resize');
        
                document.dispatchEvent(newEv);
            })
        })
    }

    // Start in the center of the screen AND with half the size of the screen OR resize and position the app as per CLI arguemnts.
    const initialResize = () => {
        if(!window.isSubwindow && SHOULD_USE_DEFAULT_SIZE) {
            let nwWindow = nw.Window.get();
            let screenWidth = screen.width;
            let screenHeight = screen.height;
            nwWindow.width = screenWidth/2;
            nwWindow.x = screenWidth/4;
        
            nwWindow.height = screenHeight/2;
            nwWindow.y = screenHeight/4;
        }

        if(!window.isSubwindow && !SHOULD_USE_DEFAULT_SIZE) {
            nwWindow.x = appDimensions.x;
            nwWindow.y = appDimensions.y;
            nwWindow.width = appDimensions.width;
            nwWindow.height = appDimensions.height;

            if(!!appDimensions.fullscreen) {
                WindowManager.maximize();
            }
        }
    }

    return {
        isFullScreen: () => {
            return isMaximized;
        },

        minimize: () => nwWindow.minimize(),
        maximize: () => {
            nwWindow.maximize();
        },
        unmaximize: () => {
            nwWindow.unmaximize();
        } ,
        windowPromptQuit,
        initialResize
    }
})()