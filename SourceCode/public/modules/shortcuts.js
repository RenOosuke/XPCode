{
    let _activeKeys = []
    let _canFillKeys = false
    let _shortcutsPaused = false;
    const FILE_EXPLORER = 'file_explorer';
    const GENERAL = 'general';

    const ACTIONS = {
        DELETE: 'delete',
        NEW_FILE: 'new_file',
        RENAME: 'rename',
        REVEAL_IN_FILE_EXPLORER: 'reveal_in_file_explorer',
        COPY: 'copy',
        CUT: 'cut',
        PASTE: 'paste',
        SEARCH_BY_FILE_NAME: 'search_by_file_name'
    }
    // let keyTranslation = {
    //     'Ctrl',
        
    // }

    // document.addEventListener('keypress', ev => {
    //     console.log(ev)

    // })
    let _rerenderSelectedItems = (() => {
        let oldConfig = {
            hoveredItem: file_explorer.hoveredItem,
            cutPaths: [...file_explorer.cutPaths],
            selectedItems: [...file_explorer.selectedItems]
        }

        return (shouldExpand) => {
            // Render old selected items as unselected
            oldConfig.selectedItems.forEach((selectedItem) => {
                file_explorer.itemEvents[selectedItem].select(false);
                // file_explorer.itemEvents[]
                let parentDir = path.dirname(selectedItem);

                if(parentDir != launchArguments) {
                    file_explorer.itemEvents[parentDir].childSelected(false);
                }
            })
            
            // Render newly selected items
            file_explorer.selectedItems.forEach((selectedItem) => {
                file_explorer.itemEvents[selectedItem].select(true);

                let parentDir = path.dirname(selectedItem);

                if(parentDir != launchArguments) {
                    file_explorer.itemEvents[parentDir].childSelected(true);
                }
            })

            // Copy the new items as "old" for the next rerender
            oldConfig.selectedItems = [...file_explorer.selectedItems];
            
            
            // =========================================Cutting
            
            // Render old cut items as unselected
            oldConfig.cutPaths.forEach((cutItem) => {
                file_explorer.itemEvents[cutItem].cut(false);
            })
            
            // Render newly cut items
            file_explorer.cutPaths.forEach((cutItem) => {
                file_explorer.itemEvents[cutItem].cut(true);
            })

            // Copy the new items as "old" for the next rerender
            oldConfig.cutPaths = [...file_explorer.cutPaths];

            // =========================================Hovering
            if(oldConfig.hoveredItem && oldConfig.hoveredItem.length>0) {
                file_explorer.itemEvents[oldConfig.hoveredItem].hover(false)
            }

            if(file_explorer.hoveredItem && file_explorer.hoveredItem.length>0) {
                file_explorer.itemEvents[file_explorer.hoveredItem].hover(true);
            }

            oldConfig.hoveredItem = file_explorer.hoveredItem;

            if(shouldExpand) {
                file_explorer.itemEvents[file_explorer.hoveredItem].expand();
            }
        }
    })()
        // document.dispatchEvent(new CustomEvent('file_explorer_element_selected', {detail: shouldExpand}));
    
    let _getVisibleElements = () => {
        return jQuery('.header-part:visible').toArray()
    };
    
    let explorerTabLevelEvent = (tab, functionName) => {
        document.dispatchEvent(new CustomEvent(`keyboard_shortcut.${tab}`, {detail: {
            functionName
        }}))
    }
    
    let customShortcutEvent = (tab, functionName) => {
        try {
            if(tab == FILE_EXPLORER) {
                switch (functionName) {
                    case ACTIONS.DELETE:
                        file_explorer.selectedItems = file_explorer.selectedItems.sort((fileA, fileB) => {
                            return fileA.length - fileB.length
                        });
    
                    
                        let selectedFolders = file_explorer.selectedItems.filter((_path) => file_explorer.folders[_path])
    
                        selectedFolders.forEach((_folder) => {
                            file_explorer.selectedItems = file_explorer.selectedItems.filter(_path => _path == _folder || !_path.includes(_folder));
                        });
    
                        file_explorer.selectedItems.forEach((_selected) => {
                            file_explorer.itemEvents[_selected].genericHotkeyAction(functionName);
                        })
                        break;
        
                    case ACTIONS.NEW_FILE:
                        if (
                            !file_explorer.grayedOut
                        ) {
                            if(file_explorer.hoveredItem) {
                                file_explorer.itemEvents[file_explorer.hoveredItem].genericHotkeyAction(functionName);
                            } else {
                                explorerTabLevelEvent(tab, functionName)
                            }
                        }
                        break;
        
                    case ACTIONS.RENAME:
                    case ACTIONS.REVEAL_IN_FILE_EXPLORER:
                    case ACTIONS.COPY:
                    case ACTIONS.CUT:
                        if(file_explorer.hoveredItem) {
                            file_explorer.itemEvents[file_explorer.hoveredItem].genericHotkeyAction(functionName);
                        }
                    break
                    case ACTIONS.PASTE:
                        if(file_explorer.folders[file_explorer.hoveredItem]) {
                            file_explorer.itemEvents[file_explorer.hoveredItem].genericHotkeyAction(functionName);
                        } else {
                            if(!file_explorer.hoveredItem) {
                                explorerTabLevelEvent(tab, functionName);
                            }
                        }
                    break
                }
            }

            if(tab == GENERAL) {
                switch(functionName) {
                    case ACTIONS.SEARCH_BY_FILE_NAME:
                        fileSearch();
                    break;
                }
            }
        } catch (bug) {
            console.error(bug);
        }
    }
    
    let shortcutTranslation = {
        'Control': 'Ctrl',
        'Meta': 'Win'
    }

    window.shortcuts = {
        getVisibleElements: _getVisibleElements,
        pause: () => {
            _shortcutsPaused = true;
        },

        start: () => {
            _shortcutsPaused = false;
        },

        rerenderSelected: _rerenderSelectedItems,
        getKeysAreRefreshed: () => {
            return _keysGotRefreshed;
        }
    }


    let _keysGotRefreshed = true;



    const checkForKeyCombinations = () => {
        let fileExplorerCombinations = settings.section.get('shortcuts.file_explorer');  
        let generalCombinations = settings.section.get('shortcuts.general');

        let fileExplorerEntries = Object.values(fileExplorerCombinations)
        let generalEntries = Object.values(generalCombinations)

        let joinedKeys = _activeKeys.map(key => shortcutTranslation[key] || key).join('__');
        

        let generalCombinationIndex = generalEntries.findIndex((val) => {
            return joinedKeys == val
        })

        console.log(joinedKeys, generalCombinationIndex);
        
        if(generalCombinationIndex > -1) {
            let generalFunctions = Object.keys(generalCombinations);
            let functionName = generalFunctions[generalCombinationIndex]
            customShortcutEvent(GENERAL, functionName);
            _keysGotRefreshed = false;
            return;
        }
 
        let fileExplorerCombinationIndex = fileExplorerEntries.findIndex((val) => {
            return joinedKeys == val
        })

        if(fileExplorerCombinationIndex > -1) {
            let fileExplorerFunctions = Object.keys(fileExplorerCombinations);
            let functionName = fileExplorerFunctions[fileExplorerCombinationIndex]
            customShortcutEvent(FILE_EXPLORER, functionName);
            _keysGotRefreshed = false;
            return;
        }
    }

    let arrowKeyOptions = {
        ArrowUp: (index, maxItems) => Math.max(0, index-1),
        ArrowDown: (index, maxItems) => Math.min(maxItems, index+1)
    }

    let pivotKeys = {
        'Control': true,
        'Shift': true,
        'Alt': true,
        'F2': true,
        'Delete': true,
        'Meta': true
    }

    let selectionCancelOptions = {
        'Escape': true,
        'Tab': true
    }

    document.addEventListener('keydown', (ev) => {
        if(pivotKeys[ev.key] && !_shortcutsPaused && _keysGotRefreshed) {
            if(!_activeKeys.includes(ev.key)) {
                _activeKeys.push(ev.key)
            }

            checkForKeyCombinations();
        }

        else if(_activeKeys.length > 0 && pivotKeys[_activeKeys[0]] && !_shortcutsPaused && _keysGotRefreshed) {
            if(!_activeKeys.includes(ev.key)) {
                _activeKeys.push(ev.key)
            }

            checkForKeyCombinations();
        }

        if(file_explorer.hoveredItem != undefined && !file_explorer.grayedOut){
            if(arrowKeyOptions[ev.key]) {
                let visibleItems = _getVisibleElements();
                let oldHoveredItem = file_explorer.hoveredItem;
                let indexOfHoveredItem = visibleItems.findIndex(el => el.getAttribute('full_path') === oldHoveredItem)
                let newIndex = arrowKeyOptions[ev.key](indexOfHoveredItem, visibleItems.length-1);
                let newElementPath = visibleItems[newIndex].getAttribute('full_path');
    
                if(ev.shiftKey) {
                    // If new path is already selected that means we're traversing back so we should deselect the oldHovered item
                    if(file_explorer.selectedItems.includes(newElementPath)) {
                        file_explorer.selectedItems = file_explorer.selectedItems.filter(_path => _path != oldHoveredItem);
                    } else {
                        // Else just add to the selection
                        file_explorer.selectedItems.push(newElementPath)
                    }
                }
                
                //the hovered item always changes regardless of case
                file_explorer.hoveredItem = newElementPath;
                _rerenderSelectedItems();
            }

            if(selectionCancelOptions[ev.key]) {
                file_explorer.hoveredItem = undefined;
                file_explorer.selectedItems = [];
                _rerenderSelectedItems();
            }

            if(ev.key == " " && !file_explorer.selectedItems.includes(file_explorer.hoveredItem)) {
                let shouldExpand = false;
                let _hoveredItem = file_explorer.hoveredItem;
                
                if(file_explorer.folders[_hoveredItem]) {
                    //it's a folder so we only expand the folder
                    shouldExpand = true;
                } else {
                    // select the item
                    file_explorer.selectedItems = [file_explorer.hoveredItem];
                }

                _rerenderSelectedItems(shouldExpand);
            }
        }
    })

    document.addEventListener('keyup', (ev) => {
        if(_activeKeys.includes(ev.key)) {
            _activeKeys = _activeKeys.filter(a => a!= ev.key)
            
            if(_activeKeys.length == 0) {
                _keysGotRefreshed = true
                console.log('Keys got refreshed');
            }
        }
    })

    window.printKeys = () => console.log(_activeKeys);
}