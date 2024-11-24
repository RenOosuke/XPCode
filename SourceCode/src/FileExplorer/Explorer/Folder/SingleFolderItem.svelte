<script>
    /** ExplorerTabFolder.svelte */
    import { onMount } from "svelte";
    export let isFolder,
        full_path,
        isStaging = false,
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
    let isCut = false;
    let shouldFocusTreeLine = false;

    let overlapsExistingPath = false;

    let new_path;

    let iconProps;

    let gotSorted = false;
    let items = children || [];

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
        if (!isFolder && full_path) {
            iconProps = iconManager.getIconForPath(full_path);
        }
    }

    $: {
        if (new_path) {
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

        if (isFolder) {
            _expansionToggle();
        }
    };

    const mirrorNameToPath = (newName) => {
        let parentDirectory = path.dirname(full_path);

        if (newName.length > 0) {
            new_path = path.join(parentDirectory, newName);

            if (new_path != full_path) {
                let pathsInParent = file_explorer.folders[parentDirectory];
                let neighborExists = pathsInParent.children.findIndex(
                    (_path) => _path.full_path == new_path,
                );
                overlapsExistingPath = neighborExists > -1;
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

            getContextMenuConfig().then((configLoaded) => {
                menu({
                    x: ev.clientX,
                    y: ev.clientY,
                    shouldBlur: true,
                    options: configLoaded.filter((a) => {
                        let optionIsCustom = a.custom;

                        return !optionIsCustom || optionIsCustom(full_path);
                    }),
                });
            });

            // Select an item by rightclicking it (only give border as if it's hovered);
            // isHovered = true;
            file_explorer.hoveredItem = full_path;
            shortcuts.rerenderSelected();

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
        console.log(items);

        if (file_explorer.staging.oldName === undefined) {
            setTimeout(() => {
                ev.focus();

                //find out what extension is in the name
                let extStr = path.extname(_name) || undefined;
                //find the index of the extension
                let indexOfExt = _name.indexOf(extStr);
                //select the name up till the extension OR the entire thing
                let end = indexOfExt > -1 ? indexOfExt : _name.length;
                ev.setSelectionRange(0, end);

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
        overlapsExistingPath = false;
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
                path.join(
                    path.dirname(full_path),
                    file_explorer.staging.oldName,
                ),
                new_path,
            );
        }

        file_explorer.staging.oldName = undefined;
        file_explorer.isStaging = isStaging;
    };

    const handleNamingBlur = (ev) => {
        if (ev.sourceCapabilities && _name.length > 0) {
            submitNaming();
        } else {
            isStaging = false;
            cancelNaming();
        }
    };

    let blurListener = (_ev) => {
        // file_explorer.selectedItems = [];
        // file_explorer.hoveredItem = undefined;
        triggerHoverRerender();
        document.removeEventListener("click", blurListener);
        file_explorer.hoverListeners--;
    };

    const triggerHoverRerender = () => {
        shortcuts.rerenderSelected();
    };

    const handleItemClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let _selectedItems = file_explorer.selectedItems;

        if (ev.ctrlKey && !ev.shiftKey) {
            if (_selectedItems.includes(full_path)) {
                file_explorer.selectedItems = _selectedItems.filter(
                    (a) => a != full_path,
                );
            } else {
                _selectedItems.push(full_path);
            }
        } else if (ev.shiftKey) {
            let visibleElements = shortcuts
                .getVisibleElements()
                .map((a) => a.getAttribute("full_path"));

            let indexesInTheVisibleItems = [
                full_path,
                file_explorer.hoveredItem,
            ]
                .map((a) => visibleElements.indexOf(a))
                .sort((a, b) => a - b)
                .filter((a) => a > -1);

            console.log(indexesInTheVisibleItems);

            let startOfSelection = indexesInTheVisibleItems[0];
            let endOfSelection =
                indexesInTheVisibleItems[indexesInTheVisibleItems.length - 1];

            let indexedRange = range(startOfSelection, endOfSelection);
            let translatedIndexesToSelectedPaths = indexedRange.map(
                (a) => visibleElements[a],
            );

            // Ctrl + Shift + Mouse Key
            if (ev.ctrlKey) {
                // all previously selected items without the hovered item to be that are in the new selection range (intersection, but without the current element)
                let preexistingItems = translatedIndexesToSelectedPaths.filter(
                    (a) => _selectedItems.includes(a) && a != full_path,
                );

                // a union of the preselected and newly selected items
                let combinedSelection = [
                    ..._selectedItems,
                    ...translatedIndexesToSelectedPaths,
                ];

                if (
                    _selectedItems.includes(full_path) &&
                    _selectedItems.includes(full_path)
                ) {
                    // remove from the union the preexisting items
                    let combinedAndFiltered = combinedSelection.filter(
                        (a) => !preexistingItems.includes(a),
                    );
                    file_explorer.selectedItems = combinedAndFiltered;
                } else {
                    file_explorer.selectedItems = combinedSelection;
                }
            } else {
                // If control key is not held, selected items are from previously clicked item up till the current item clicked
                file_explorer.selectedItems = translatedIndexesToSelectedPaths;
            }
        } else {
            file_explorer.selectedItems = [full_path];

            if (!isFolder) {
                file_explorer.openItem(full_path)
            }
        }

        file_explorer.hoveredItem = full_path;

        if (file_explorer.hoverListeners == 0) {
            document.addEventListener("click", blurListener);
            file_explorer.hoverListeners++;
        }

        outline.grayedOut = true;
        file_explorer.grayedOut = false;
        themeUtils.setGrayedOut();

        triggerHoverRerender();
    };

    const genericHotkeyAction = (action) => {
        getContextMenuConfig().then((configLoaded) => {
            let funcConfig = configLoaded.find((op) => op.name == action);

            funcConfig.click();
        });
    };

    onMount(() => {
        file_explorer.itemEvents[full_path] = {
            select: (selectionValue) => {
                isSelected = selectionValue;
            },

            hover: (hoverValue) => {
                isHovered = hoverValue;
                // isHovered = full_path == file_explorer.hoveredItem;
            },

            cut: (cutValue) => {
                isCut = cutValue; //file_explorer.cutPaths.includes(full_path)
            },
            genericHotkeyAction,
        };

        if (isFolder) {
            let treeChangeEvent = (ev) => {
                let eventDetails = ev;

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

            let subItemSelected = (selectionValue) => {
                shouldFocusTreeLine = selectionValue;
            };

            file_explorer.itemEvents[full_path].childrenRerender =
                treeChangeEvent;
            file_explorer.itemEvents[full_path].expand = _expansionToggle;
            file_explorer.itemEvents[full_path].childSelected = subItemSelected;
        }
    });
</script>

<!-- on:blur={handleFileBlur} -->

<!-- on:click={handleItemClick} -->
<div
    class="single-folder-item index{index} {isExpanded
        ? 'expanded'
        : ''}{parentIsExpanded ? '' : ' parent-colapsed'} {isSelected
        ? 'item_selected'
        : ''} staging-{isStaging}{overlapsExistingPath ? ' hasError' : ''}"
>
    <div
        class="header-part {isHovered ? ' _hovered' : ''}{isSelected
            ? ' _selected'
            : ''}{isCut ? ' is-cut' : ''}"
        style="padding-left: {1 + level * 0.7}rem;"
        on:click={handleExpansionToggle}
        on:contextmenu={handleContextMenu}
        id={isEditable ? "" : "unselectable"}
        {full_path}
    >
        <div class="left-side">
            <!-- {#if level>0}
                <div class="tree-line">

                </div>
            {/if} -->

            {#if isFolder}
                <div class="arrow-placeholder">
                    <div
                        style="-webkit-mask-size: 1rem;"
                        class="arrow-icon"
                    ></div>
                </div>
            {:else}
                <div class="file-icon-placeholder {iconProps}"></div>
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

    {#if isFolder && isExpanded}
        <div
            class="tree-line {shouldFocusTreeLine ? 'tree_focused' : ''}"
            style="left: {1.65 + level * 0.7}rem;"
        ></div>
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
        background-color: var(--file-hover-unselected);
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

    .single-folder-item {
        position: relative;
    }

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
        border: solid 1px transparent !important;
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

    .staging-false .is-cut .directory-name,
    .staging-false .is-cut .file-icon-placeholder {
        opacity: 0.5;
    }

    .tree-line {
        height: calc(100% - 1.4rem);
        /* height: calc(100% + .2rem); */
        width: 1px;
        background-color: var(--tree-line);
        /* border-left: 1px solid var(--tree-line); */
        position: absolute;
        z-index: 1000;
        top: 1.4rem;
        /* top: 50%; */
        /* transform: translate(0, -50%); */
    }

    .tree-line.tree_focused {
        border-left: solid 1px var(--focused-tree-line) !important;
    }
</style>
