<script>
  import { onMount } from "svelte";

    // /** @type {{isFolder: boolean; full_path: string; isStaging: boolean; new: boolean; name: string;}}*/
    // export let properties;
    export let isFolder, full_path, isStaging = undefined, 
    _new = undefined, _name, children = undefined;
    export let level;
    export let parentIsExpanded;
    export let index;
    export let entityDirectory;

    let isExpanded = false;
    let isEditable = false;
    let isHovered = false;
    let isSelected = false;

    // let iconProps = iconManager.getIconForPath(full_path);
    let gotSorted = false;
    let items = [];

    let oldName;

    if(isStaging) {
        // console.log(properties);
    }
    
    if(!isFolder) {

    }

    $: {
        if(isStaging  && !isFolder) {
            // iconProps = iconManager.getIconForPath(full_path);
            // console.log('SHOULD FOCUS FIELD')
        }
    }

    const reloadChildren = () => {
        // console.log(parentIsExpanded, level);

        if(parentIsExpanded) {
                items = isFolder ? file_explorer.sortDirectories(children || []) : [];
                // console.log('Rerendered children: ' + full_path);
        }
    }

    $: {
        if(parentIsExpanded) {
            reloadChildren();
        }
    }
    
    const _expansionToggle = () => {
        isExpanded = !isExpanded;
        file_explorer.tree[full_path] = isExpanded;
        
        if(!gotSorted) {
            items = file_explorer.sortDirectories(items);
            gotSorted = true;
        }

    }

    const handleExpansionToggle = (ev) => {
        ev.stopPropagation();

        handleItemClick(ev);
        _expansionToggle();
    }

    const mirrorNameToPath = (newName) => {
        let parentDirectory = path.dirname(full_path);

        if(newName.length > 0) {
            full_path = path.join(parentDirectory, newName)
        }
    }

    const handleContextMenu = (ev, ) => {
        if(!ev.altKey) {
            ev.preventDefault();
            ev.stopPropagation();
            
            const evaluator = (fieldToUpdate, newValue) => {
                switch(fieldToUpdate) {
                    case 'isStaging':
                        isStaging = eval(newValue)
                        break
                }
            }

            menu({
                x: ev.clientX,
                y: ev.clientY,
                shouldBlur: true,
                options: file_explorer.explorerItemMenuConfig(full_path, evaluator, {isStaging, isFolder}).filter(a => {
                    let optionIsCustom = a.custom;
                    console.log(a)

                    return !optionIsCustom || optionIsCustom(full_path)
                }),
            });

            // ev.stopPropagation();
        } else {
            // ev.preventDefault();
            ev.stopPropagation();
        }
    };

    $: {
        let eventDetails = file_explorer.changeEvent;

        if(eventDetails && parentIsExpanded) {
            if(eventDetails.level === level && full_path.includes(eventDetails.parentDir)) {
                if(isFolder) {
                    items = file_explorer.sortDirectories(file_explorer.folders[full_path].children);
                    isExpanded = file_explorer.tree[full_path];
                    console.log('CUSTOM EVENT', items);
                }
            }
        }
    }

    const initialFormFocus = (ev) => {
        ev.focus();

        let keyDownListener = (keypressed) => {
            if(keypressed.code === 'Escape') {
                ev.blur();
                ev.removeEventListener('keydown', keyDownListener);
            }

            if(keypressed.code === 'Enter') {
                submitNaming();
            }

        };

        ev.addEventListener('keydown', keyDownListener);

        if(!_new) {
            oldName = _name;
        }
    }

    const handleFileNaming = (ev) => {
        let newName = ev.target.value;
        mirrorNameToPath(newName);
    }

    const cancelNaming = () => {
        if(_new) {
            file_explorer.cancelStaging();
        } else {
            mirrorNameToPath(oldName);
            isStaging = false;
        }
    }

    const submitNaming = () => {
        isStaging = false;

        if(_new) {
            if(isFolder) {
                fs.mkdirSync(full_path, {});
            } else {
                fs.writeFileSync(full_path, '', {encoding: 'utf-8'});
            }
        } else {
            fs.renameSync(path.join(path.dirname(full_path), oldName), full_path);
        }

        // file_explorer.rescan();
    }

    const handleNamingBlur = (ev) => {
        if(!ev.sourceCapabilities || _name.length === 0) {
            cancelNaming();
        } else {
            submitNaming();
        }
    }
    
    let blurListener = (_ev) => {
        file_explorer.selectedItems = [];
        file_explorer.hoveredItem = undefined;
        triggerHoverRerender();
        document.removeEventListener('click', blurListener);
        file_explorer.hoverListeners--;
    }

    const triggerHoverRerender = () => {
        document.dispatchEvent(new CustomEvent('file_explorer_element_selected'));
    }

    const handleItemClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if(ev.ctrlKey) {
            file_explorer.selectedItems.push(full_path);
        } else {
            file_explorer.selectedItems = [full_path];
        }

        file_explorer.hoveredItem = full_path;
        
        if(file_explorer.hoverListeners == 0) {
            document.addEventListener('click', blurListener)
            file_explorer.hoverListeners++;
        }

        triggerHoverRerender();
    }

    const handleFileBlur = (ev) => {
        console.log(ev);
    }

    onMount(()=> {
        document.addEventListener('file_explorer_element_selected', (ev) => {
            isHovered = full_path == file_explorer.hoveredItem;
            isSelected = file_explorer.selectedItems.includes(full_path);

            if(ev.detail && isHovered) {
                _expansionToggle()
            }
        })

        document.addEventListener('keyboard_shortcut', (ev) => {
            console.log(ev);
        })
    })
</script>

<!-- on:click={handleItemClick} -->
<div class="single-folder-item index{index} {isExpanded ? 'expanded' : ''}{parentIsExpanded ? '' : ' parent-colapsed'} staging-{isStaging}" >
    <div class="header-part {isHovered ? ' _hovered': ''}{isSelected ? ' _selected' : ''}" style="padding-left: {1 + level*.7}rem;" on:click={handleExpansionToggle} on:contextmenu={handleContextMenu} id="{isEditable ? '' : 'unselectable'}" on:blur={handleFileBlur} full_path={full_path}>
        <div class="left-side">
            {#if isFolder}
                <div class="arrow-placeholder">
                    <div style="-webkit-mask-size: 1rem;" class="arrow-icon">
                    </div>
                </div>
            {:else}
                <div class="file-icon-placeholder {iconManager.getIconForPath(full_path) || iconProps}">
                </div>
            {/if}

            {#if isStaging}
                <input class="staging-directory-name" placeholder="" use:initialFormFocus on:input={handleFileNaming} bind:value={_name} on:blur={handleNamingBlur}/>
            {:else}
                <div class="directory-name">
                    {_name}
                </div>
            {/if}
        </div>
    </div>

    {#if items}
        {#each items as singleItemProps, childIndex}
            <svelte:self     
            bind:isFolder={singleItemProps.isFolder}
            bind:full_path={singleItemProps.full_path}
            bind:isStaging={singleItemProps.isStaging}
            bind:_new={singleItemProps.new}
            bind:_name={singleItemProps.name}
            bind:children={singleItemProps.children} level={level+1} parentIsExpanded={isExpanded} index={childIndex} entityDirectory={singleItemProps.name}/>
        {/each}
    {/if}
</div>


<style>
    .arrow-icon {
        background-color: var(--sidebar-inactive-icon);
        height: 1rem;
        width: 1rem;
        margin-right: .2rem;
        margin-top: auto;
        margin-bottom: auto;
    }

    .arrow-icon {
        -webkit-mask: var(--chevron-right-icon);
    }
    
    .expanded > .header-part > .left-side > .arrow-placeholder > .arrow-icon {
        -webkit-mask: var(--chevron-down-icon);
    }

    .header-part {
        display: flex;
        padding: .1rem 0;
        min-height: 1rem;
        /* margin-bottom: .1rem; */
        cursor: pointer !important;
        border: solid 1px transparent;
    }

    .header-part:focus {
        outline-color: var(--outline-color);
    }

    .header-part:hover:not(._hovered):not(._selected) {
        background-color: #2a2d2e;
        cursor: pointer;
    }

    .left-side {
        display: flex;
        width: -webkit-fill-available;
    }

    .arrow-placeholder {
        display: flex;
        width: 1.2rem;
        margin-left: .17rem;
    }

    .file-icon-placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: .15rem;
    }
    
    .file-icon-placeholder::before {
        font-family: 'Seti_Icon';
        background-image: unset;
        font-size: 130%;
        width: 1.2rem;
    }

    .directory-name {
        line-height: 1.2;
        font-size: .8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-bottom: .05rem;
    }

    .parent-colapsed {
        display: none;
    }

    .staging-directory-name {
        width: -webkit-fill-available;
        padding: 0;
        border: 0;
        background: none;
        margin: 0;
        background-color: var(--directory-rename-bg);
        color: var(--base-text-color);
    }

    .staging-directory-name:focus {
        outline-color: var(--outline-color);
    }
    /* .single-folder-item {
        display: flex;
        flex-direction: column;
    } */

    ._hovered {
        border: solid 1px var(--outline-color);
    }
        
    ._selected {
        background-color: var(--item-select-bg);    
     }

     :global(.explorer-tab-header.folder.grayed-out + .current-directory ._selected) {
        background-color: var(--gray-out-selection) !important;
    }
</style>