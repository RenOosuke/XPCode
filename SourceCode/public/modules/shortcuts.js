{
    let _activeKeys = []
    let _canFillKeys = false
    let _shortcutsPaused = false;

    // let keyTranslation = {
    //     'Ctrl',
        
    // }

    // document.addEventListener('keypress', ev => {
    //     console.log(ev)

    // })
    window.shortcuts = {
        pause: () => {
            _shortcutsPaused = true;
        },

        start: () => {
            _shortcutsPaused = false;
        }
    }

    let _keysGotRefreshed = true;

    const checkForKeyCombinations = () => {
        if(_keysGotRefreshed) {
            console.log(_activeKeys, 'Got triggered');
            _keysGotRefreshed = false;
        }
    }

    let arrowKeyOptions = {
        ArrowUp: (index, maxItems) => Math.max(0, index-1),
        ArrowDown: (index, maxItems) => Math.min(maxItems, index+1)
    }

    let pivotKeys = {
        'Control': true,
        'Shift': true,
        'Alt': true
    }

    let selectionCancelOptions = {
        'Escape': true,
        'Tab': true
    }

    let _rerenderSelectedItems = (shouldExpand) => document.dispatchEvent(new CustomEvent('file_explorer_element_selected', {detail: shouldExpand}));

    document.addEventListener('keydown', (ev) => {
        if(pivotKeys[ev.key] && !_shortcutsPaused) {
            if(!_activeKeys.includes(ev.key)) {
                _activeKeys.push(ev.key)
            }

            checkForKeyCombinations();
        }

        else if(_activeKeys.length > 0 && pivotKeys[_activeKeys[0]] && !_shortcutsPaused) {
            if(!_activeKeys.includes(ev.key)) {
                _activeKeys.push(ev.key)
            }

            checkForKeyCombinations();
        }

        if(file_explorer.hoveredItem != undefined){
            if(arrowKeyOptions[ev.key]) {
                let visibleItems = jQuery('.header-part:visible').toArray();
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
            }
        }
    })

    window.printKeys = () => console.log(_activeKeys);
}