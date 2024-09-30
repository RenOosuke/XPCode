<script>
    export let properties;
    export let level;
    export let parentIsExpanded;
    let isExpanded = false;
    let isEditable = false;

    let {} = properties;
    let iconProps = iconManager.getIconForPath(properties.full_path);
    let gotSorted = false;
    let items = properties.isFolder ? file_explorer.sortDirectories(properties.children || []) : [];

    if(!properties.isFolder) {

    }

    const handleExpansionToggle = (ev) => {
        ev.stopPropagation();
        isExpanded = !isExpanded;

        if(!gotSorted) {
            items = file_explorer.sortDirectories(items);
            gotSorted = true;
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
            name: "copy_path"
        },
        {
            label: "Copy Relative Path",
            name: "copy_relative_path"
        },
        {
            separator: true
        },
        {
            label: "Rename...",
            name: "rename"
        },
        {
            label: "Delete",
            name: "delete"
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

                    return !otionIsCustom || otionIsCustom(properties.full_path)
                }),
            });
        } else {
            // ev.preventDefault();
            ev.stopPropagation();
        }
    };
</script>


<div class="single-folder-item {isExpanded ? 'expanded' : ''}{parentIsExpanded ? '' : ' parent-colapsed'}">
    <div class="header-part" style="padding-left: {1 + level*.7}rem;" on:click={handleExpansionToggle} on:contextmenu={handleContextMenu} id="{isEditable ? '' : 'unselectable'}">
        <div class="left-side">
            {#if properties.isFolder}
                <div class="arrow-placeholder">
                    <div style="-webkit-mask-size: 1rem;" class="arrow-icon">
                    </div>
                </div>
            {:else}
                <div class="file-icon-placeholder {iconProps}">
                </div>
            {/if}

            <div class="directory-name">
                {properties.name}
            </div>
        </div>
    </div>

    {#if items}
        {#each items as singleItemProps}
            <svelte:self properties={singleItemProps} level={level+1} parentIsExpanded={isExpanded}/>
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

    .header-part:hover {
        background-color: #2a2d2e;
        cursor: pointer;
    }

    .left-side {
        display: flex;
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

    /* .single-folder-item {
        display: flex;
        flex-direction: column;
    } */
</style>