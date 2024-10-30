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
    
    const localRescan = () => {

    }

    const handleExpansionToggle = (ev) => {
        ev.stopPropagation();
        isExpanded = !isExpanded;
        file_explorer.tree[full_path] = isExpanded;
        
        if(!gotSorted) {
            items = file_explorer.sortDirectories(items);
            gotSorted = true;
        }

        // if(!children) {
        //     console.log(properties, iconProps,)
        // }
    }

    const mirrorNameToPath = (newName) => {
        let parentDirectory = path.dirname(full_path);

        if(newName.length > 0) {
            full_path = path.join(parentDirectory, newName)
        }
    }

    const handleContextMenu = (ev, ) => {
        if(ev.altKey) {
            ev.preventDefault();

            menu({
                x: ev.clientX,
                y: ev.clientY,
                shouldBlur: true,
                options: file_explorer.explorerItemMenuConfig(full_path).filter(a => {
                    let optionIsCustom = a.custom;

                    return !optionIsCustom || otionIsCustom(full_path)
                }),
            });
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

    onMount(()=> {
        // let treeChangeEvent = (ev) => {
        //     let eventDetails = ev.detail;

        //     if(eventDetails.level === level && full_path.includes(eventDetails.parentDir)) {
        //         if(isFolder) {
        //             items = file_explorer.sortDirectories(file_explorer.folders[full_path].children);
        //             isExpanded = file_explorer.tree[full_path] = isExpanded;
        //             console.log('CUSTOM EVENT', items);
        //         }
        //     }

        //     // if(eventDetails.level === level+1 && eventDetails.parentDir.includes(full_path)) {
        //     //     if(isFolder) {
        //     //         items = ;
        //     //     }
        //     // }
        //     // scan();
        //     // console.log(ev);
        //     // if(eventDetails.parentDir === launchArguments) {
        //     //     if(eventDetails.create) {
        //     //         let elementToPush = eventDetails.element;

        //     //         folderItems = [
        //     //             ...folderItems.slice(0, eventDetails.index),
        //     //             elementToPush,
        //     //             ...folderItems.slice(eventDetails.index)
        //     //         ];
        //     //     } else {
        //     //         folderItems = [
        //     //             ...folderItems.slice(0, eventDetails.index),
        //     //             ...folderItems.slice(eventDetails.index+1)
        //     //         ]

        //     //         console.log(folderItems);
        //     //     }
        //     // }

        // }

        // document.addEventListener('tree_changed', treeChangeEvent);
    })
</script>


<div class="single-folder-item index{index} {isExpanded ? 'expanded' : ''}{parentIsExpanded ? '' : ' parent-colapsed'} staging-{isStaging}">
    <div class="header-part" style="padding-left: {1 + level*.7}rem;" on:click={handleExpansionToggle} on:contextmenu={handleContextMenu} id="{isEditable ? '' : 'unselectable'}">
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
    }

    .header-part:focus {
        outline-color: var(--outline-color);
    }

    .header-part:hover {
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
</style>