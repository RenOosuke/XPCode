<script>
  import { onMount } from "svelte";

    // /** @type {{isFolder: boolean; full_path: string; isStaging: boolean; new: boolean; name: string;}}*/
    // export let properties;
    export let isFolder, full_path, isStaging, _new, _name, children;
    export let level;
    export let parentIsExpanded;
    export let index;
    export let entityDirectory;

    let isExpanded = false;
    let isEditable = false;

    // let iconProps = iconManager.getIconForPath(full_path);
    let gotSorted = false;
    let items = [];
    
    let cachedPath;

    let oldName;

    if(isStaging) {
        console.log(properties);
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
        console.log(parentIsExpanded);

        if(parentIsExpanded) {
                items = isFolder ? file_explorer.sortDirectories(children || []) : [];
                console.log('Rerendered children');
                isExpanded = file_explorer.tree[full_path] = isExpanded;
        }
    }

    reloadChildren();

    $: {
        // if(full_path != cachedPath || parentIsExpanded) {
        //     // console.log(full_path);
        //     cachedPath = full_path;
            
        //     reloadChildren();
        // }
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

        if(!children) {
            console.log(properties, iconProps,)
        }
    }

    const mirrorNameToPath = (newName) => {
        let parentDirectory = path.dirname(full_path);

        if(newName.length > 0) {
            full_path = path.join(parentDirectory, newName)
        }
    }

    const contextMenuConfigs = [
        {
            label: 'Open Preview',
            name: 'open_preview',
            custom: (filePath) => {
                let fileBasename = path.basename(filePath);
                let isAMarkdownFile = fileBasename.includes('.md');
                
                let canPreview = isAMarkdownFile; 

                return canPreview;
            }
        },
        {
            label: "Run Code",
            name: "run_code"
        },
        {
            label: "Open to the Side",
            name: "open_to_the_side"
        },
        {
            label: "Open With...",
            name: "open_with"
        },
        {
            label: "Reveal in File Explorer",
            name: "reveal_in_file_explorer"
        },
        {
            label: "Open in Integrated Terminal",
            name: "open_in_integrated_terminal"
        },
        {
            separator: true
        },
        {
            label: "Select for Compare",
            name: "select_for_compare"
        },
        {
            label: "Find File References",
            name: "find_file_references"
        },
        {
            label: "Open Timeline",
            name: "open_timeline"
        },
        {
            separator: true
        },
        {
            label: "Cut",
            name: "cut"
        },
        {
            label: "Copy",
            name: "copy"
        },
        {
            separator: true
        },
        {
            label: "Copy Path",
            name: "copy_path",
            click: () => {
                fsUtils.copyToClipboard(full_path);
            }
        },
        {
            label: "Copy Relative Path",
            name: "copy_relative_path",
            click: () => {
                fsUtils.copyToClipboard(path.relative(launchArguments, full_path));
            }
        },
        {
            separator: true
        },
        {
            label: "Rename...",
            name: "rename",
            click: () => {
                isStaging = !isStaging;
            }
        },
        {
            label: "Delete",
            name: "delete", //
            click: () => {
                console.log('Deleting');

                if(isFolder) {
                    fs.rmdirSync(full_path);
                } else {
                    fs.unlinkSync(full_path);
                }

                // file_explorer.rescan();
            }
        }
    ]   

    const handleContextMenu = (ev, ) => {
        if(ev.altKey) {
            ev.preventDefault();

            menu({
                x: ev.clientX,
                y: ev.clientY,
                shouldBlur: true,
                options: contextMenuConfigs.filter(a => {
                    let otionIsCustom = a.custom;

                    return !otionIsCustom || otionIsCustom(full_path)
                }),
            });
        } else {
            // ev.preventDefault();
            ev.stopPropagation();
        }
    };

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
        line-height: 1.3;
        font-size: .85rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
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