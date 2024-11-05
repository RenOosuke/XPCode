<script>
    /** ExplorerTabFolder.svelte */
    import { onMount } from "svelte";
    export let isFolder,
        full_path,
        isStaging = undefined,
        _new = undefined,
        _name,
        children = undefined;
    export let level;
    export let parentIsExpanded;
    export let index;
    export let entityDirectory;

    let isExpanded = false;
    let isEditable = false;
    let isHovered = false;
    let isSelected = false;
    let isEditing = true;
    let overlapsExistingPath = false;

    let new_path;

    let iconProps;

    let gotSorted = false;
    let items = [];

    const reloadChildren = () => {
        // console.log(parentIsExpanded, level);

        if (parentIsExpanded) {
            items = isFolder
                ? file_explorer.sortDirectories(children || [])
                : [];
        }
    };

    $: {
        if (!isEditing && parentIsExpanded && isFolder) {
            reloadChildren();
        }
    }
    
    $: {
        if(!isFolder && full_path) {
            iconProps = iconManager.getIconForPath(full_path)
        }
    }

    $: {
        if(new_path) {
            iconProps = iconManager.getIconForPath(new_path);
        }
    }

    const _expansionToggle = () => {
        isExpanded = !isExpanded;
        file_explorer.tree[full_path] = isExpanded;

        if (!gotSorted) {
            items = file_explorer.sortDirectories(items);
            gotSorted = true;
        }
    };

    const handleExpansionToggle = (ev) => {
        ev.stopPropagation();

        handleItemClick(ev);
        _expansionToggle();
    };

    const mirrorNameToPath = (newName) => {
        let parentDirectory = path.dirname(full_path);

        if (newName.length > 0) {
            new_path = path.join(parentDirectory, newName);
            
            if(new_path != full_path) {
                let pathsInParent = file_explorer.folders[parentDirectory];
                let neighborExists = pathsInParent.children.findIndex(_path => _path.full_path == new_path);
                overlapsExistingPath = neighborExists > -1
            } else {
                overlapsExistingPath = false;
            }
        }
    };

    const evaluator = (fieldToUpdate, newValue) => {
        switch (fieldToUpdate) {
            case "isStaging":
                isStaging = eval(newValue);
                break;
        }
    };

    const folderBasedFunctions = () => {
        let initial = {};

        if (isFolder) {
            // function to create a new file in the current selected folder
            initial.new_file = () => {
                isExpanded = true;

                setTimeout(() => {
                    let firstFileIndex = items.findIndex(
                        (a) => a.isFolder === false,
                    );

                    items = [
                        ...items.slice(0, firstFileIndex),
                        {
                            name: "",
                            full_path: path.resolve(`${full_path}\\New File`),
                            isFolder: false,
                            isStaging: true,
                            new: true,
                        },
                        ...items.slice(firstFileIndex),
                    ];

                    file_explorer.cancelStaging = () => {
                        items = [...items.filter((a) => !a.new)];
                    };
                }, 10);
            };

            initial.new_folder = () => {
                isExpanded = true;

                setTimeout(() => {
                    items = [
                        {
                            name: "",
                            full_path: path.resolve(`${full_path}\\New Folder`),
                            isFolder: true,
                            isStaging: true,
                            new: true,
                        },
                        ...items,
                    ];

                    file_explorer.cancelStaging = () => {
                        items = [...items.filter((a) => !a.new)];
                    };
                }, 10);
            };
        }

        return initial;
    };

    const getContextMenuConfig = () => {
        return file_explorer.explorerItemMenuConfig(
            full_path,
            evaluator,
            spreader({ isStaging, isFolder }, folderBasedFunctions()),
        );
    };

    const handleContextMenu = (ev) => {
        if (!ev.altKey) {
            ev.preventDefault();
            ev.stopPropagation();

            menu({
                x: ev.clientX,
                y: ev.clientY,
                shouldBlur: true,
                options: getContextMenuConfig().filter((a) => {
                    let optionIsCustom = a.custom;

                    return !optionIsCustom || optionIsCustom(full_path);
                }),
            });

            // Select an item by rightclicking it (only give border as if it's hovered);
            isHovered = true;

            // Unselect it on blur, but don't remove the defautl listener
            let _hoverRerender = () => {
                blurListener();
                document.removeEventListener("click", _hoverRerender);
            };

            document.addEventListener("click", _hoverRerender);
        } else {
            ev.stopPropagation();
        }
    };

    const initialFormFocus = (ev) => {
        if(file_explorer.staging.oldName === undefined) {
            setTimeout(() => {
                ev.focus();
    
                //find out what extension is in the name
                let extStr = path.extname(_name) || undefined;
                //find the index of the extension
                let indexOfExt = _name.indexOf(extStr);
                //select the name up till the extension OR the entire thing
                let end = indexOfExt > -1 ? indexOfExt : _name.length;
                ev.setSelectionRange(0, end)

                let keyDownListener = (keypressed) => {
                    if (keypressed.code === "Escape") {
                        ev.removeEventListener("keydown", keyDownListener);
                        ev.blur();
                    }
                    
                    if (keypressed.code === "Enter" && !overlapsExistingPath) {
                        ev.removeEventListener("keydown", keyDownListener);
                        submitNaming();
                    }
                };
    
                ev.addEventListener("keydown", keyDownListener);
    
                if (!_new) {
                    file_explorer.staging.oldName = _name;
                }
            }, 10);
        }
    };

    const handleFileNaming = (ev) => {
        let newName = ev.target.value || _name;
        mirrorNameToPath(newName);
    };

    const cancelNaming = () => {
        if (_new) {
            file_explorer.cancelStaging();
        } else {
            // mirrorNameToPath(file_explorer.staging.oldName || _name);
            isStaging = false;
        }

        _name = file_explorer.staging.oldName || _name;
        new_path = false;
        overlapsExistingPath = false
        file_explorer.staging.oldName = undefined;
        file_explorer.isStaging = isStaging;
    };

    const submitNaming = () => {
        isStaging = false;

        let nameIsDifferent = _name != file_explorer.staging.oldName;

        if (_new && nameIsDifferent) {
            file_explorer.cancelStaging();

            if (isFolder) {
                fs.mkdirSync(new_path, {});
            } else {
                fs.writeFileSync(new_path, "", { encoding: "utf-8" });
            }
        }

        if (!_new && nameIsDifferent) {
            fs.renameSync(
                path.join(path.dirname(full_path), file_explorer.staging.oldName),
                new_path,
            );
        }
        
        file_explorer.staging.oldName = undefined;
        file_explorer.isStaging = isStaging;
    };

    const handleNamingBlur = (ev) => {
        if(ev.sourceCapabilities && _name.length > 0) {
            submitNaming();
        } else {            
            isStaging = false;
            cancelNaming();
        }
    };

    let blurListener = (_ev) => {
        file_explorer.selectedItems = [];
        file_explorer.hoveredItem = undefined;
        triggerHoverRerender();
        document.removeEventListener("click", blurListener);
        file_explorer.hoverListeners--;
    };

    const triggerHoverRerender = () => {
        document.dispatchEvent(
            new CustomEvent("file_explorer_element_selected"),
        );
    };

    const handleItemClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (ev.ctrlKey) {
            file_explorer.selectedItems.push(full_path);
        } else {
            file_explorer.selectedItems = [full_path];
        }

        file_explorer.hoveredItem = full_path;

        if (file_explorer.hoverListeners == 0) {
            document.addEventListener("click", blurListener);
            file_explorer.hoverListeners++;
        }

        triggerHoverRerender();
    };

    onMount(() => {
        document.addEventListener("file_explorer_element_selected", (ev) => {
            isHovered = full_path == file_explorer.hoveredItem;
            isSelected = file_explorer.selectedItems.includes(full_path);

            if (ev.detail && isHovered) {
                _expansionToggle();
            }
        });

        document.addEventListener("keyboard_shortcut.file_explorer", (ev) => {
            let action = ev.detail.functionName;
            switch (action) {
                case "rename":
                    if (full_path == file_explorer.selectedItems[0]) {
                        let funcConfig = getContextMenuConfig().find(
                            (op) => op.name == action,
                        );
                        funcConfig.click();
                    }
                break;

                case "delete":
                    if (file_explorer.selectedItems.includes(full_path)) {
                        let funcConfig = getContextMenuConfig().find(
                            (op) => op.name == action,
                        );

                        if (isFolder) {
                            let childItems = file_explorer.selectedItems.filter(
                                (_path) => _path.includes(`${full_path}\\`),
                            );
                            file_explorer.selectedItems =
                                file_explorer.selectedItems.filter(
                                    (_path) => !childItems.includes(_path),
                                );
                        }

                        funcConfig.click();
                    }
                    break;

                case "new_file":
                    if (
                        !file_explorer.grayedOut &&
                        file_explorer.hoveredItem == full_path && 
                        isFolder
                    ) {
                        let funcConfig = getContextMenuConfig().find(
                            (op) => op.name == action,
                        );
                        funcConfig.click();
                    }
                    break;

                case  "reveal_in_file_explorer":
                    if (file_explorer.hoveredItem == full_path) {
                        let funcConfig = getContextMenuConfig().find(
                            (op) => op.name == action,
                        );
                        
                        funcConfig.click();
                    }
                break;
            }
        });

        if (isFolder) {
            let treeChangeEvent = (ev) => {
                let eventDetails = ev.detail;
                file_explorer.changeEvent = eventDetails;

                if (eventDetails.parentDir === full_path) {
                    if (eventDetails.create) {
                        let elementToPush = eventDetails.element;

                        items = [
                            ...items.slice(0, eventDetails.index),
                            elementToPush,
                            ...items.slice(eventDetails.index),
                        ];
                    } else {
                        items = [
                            ...items.slice(0, eventDetails.index),
                            ...items.slice(eventDetails.index + 1),
                        ];
                    }
                }
            };

            document.addEventListener("tree_changed", treeChangeEvent);
        }
    });
</script>

<!-- on:blur={handleFileBlur} -->

<!-- on:click={handleItemClick} -->
<div
class="single-folder-item index{index} {isExpanded
        ? 'expanded'
        : ''}{parentIsExpanded ? '' : ' parent-colapsed'} staging-{isStaging}{overlapsExistingPath ? ' hasError' : ''}"
>
<div
        class="header-part {isHovered ? ' _hovered' : ''}{isSelected
            ? ' _selected'
            : ''}"
        style="padding-left: {1 + level * 0.7}rem;"
        on:click={handleExpansionToggle}
        on:contextmenu={handleContextMenu}
        id={isEditable ? "" : "unselectable"}
        {full_path}
        >
        <div class="left-side">
            {#if isFolder}
            <div class="arrow-placeholder">
                <div
                style="-webkit-mask-size: 1rem;"
                class="arrow-icon"
                ></div>
            </div>
            {:else}
            <div
            class="file-icon-placeholder {iconProps}"
            ></div>
            {/if}
            
            {#if isStaging}
            <input
            class="staging-directory-name"
            placeholder=""
            use:initialFormFocus
            on:blur={handleNamingBlur}
            on:input={handleFileNaming}
            bind:value={_name}
                    />
                    {:else}
                    <div class="directory-name">
                        {_name}
                    </div>
                    {/if}
                </div>
            </div>
            
    {#if items}
        {#each items as singleItemProps, childIndex (singleItemProps.full_path)}
            <svelte:self
                bind:isFolder={singleItemProps.isFolder}
                bind:full_path={singleItemProps.full_path}
                bind:isStaging={singleItemProps.isStaging}
                bind:_new={singleItemProps.new}
                bind:_name={singleItemProps.name}
                bind:children={singleItemProps.children}
                level={level + 1}
                parentIsExpanded={isExpanded}
                index={childIndex}
                entityDirectory={singleItemProps.name}
            />
        {/each}
    {/if}
</div>

<style>
    .arrow-icon {
        background-color: var(--sidebar-inactive-icon);
        height: 1rem;
        width: 1rem;
        margin-right: 0.2rem;
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
        padding: 0.1rem 0;
        min-height: 1rem;
        /* margin-bottom: .1rem; */
        cursor: pointer !important;
        border: solid 1px transparent;
        position: relative;
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
        margin-left: 0.17rem;
    }

    .file-icon-placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 0.15rem;
    }

    .file-icon-placeholder::before {
        font-family: "Seti_Icon";
        background-image: unset;
        font-size: 130%;
        width: 1.2rem;
    }

    .directory-name {
        line-height: 1.2;
        font-size: 0.8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-bottom: 0.05rem;
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

    :global(
            .explorer-tab-header.folder.grayed-out
                + .current-directory
                ._selected
        ) {
        background-color: var(--gray-out-selection) !important;
    }

    :global(
            .explorer-tab-header.folder.grayed-out
                + .current-directory
                ._hovered
        ) {
        border: solid 1px transparent;
    }

    
    .hasError input {
        border: solid 1px var(--error-border-color) !important;
    }

    .staging-true ._selected {
        background-color: var(--gray-out-selection) !important;
    }
    
    .staging-true ._hovered {
        border: solid 1px transparent !important;
    }
    
    input {
        position: absolute;
        border: solid 1px transparent;
    }

    .staging-true input {
        top: 0;
        right: 0;
        width: calc(100% - 2.2rem);
        height: 100%;
        /* transform: translate(0%, -15%); */
    }

    .staging-true input:focus {
        outline: none;
        border: solid 1px var(--outline-color);    
    }
</style>
