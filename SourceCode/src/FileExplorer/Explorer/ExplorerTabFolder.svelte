<script>
    /** ExplorerTabFolder.svelte */
    import { onMount } from "svelte";
    import SingleFolderItem from "./Folder/SingleFolderItem.svelte";
    import { children } from "svelte/internal";
    export let isExpanded;

    let folderItems = [];
    let lastRescanned;

    const rerenderEvent = (directoryEl) => {
        let directoriesInPath = directoryEl.full_path.split("\\").length;
        let directoriesInLaunchPath =
            workspaceDirectory.full_path.split("\\").length;
        let level = directoriesInPath - directoriesInLaunchPath;
        console.log(level);
    };

    const targetlessMenu = () => {
        return clipboardHelper.sendCommand('check').then(clipboardData => {
            const isPasteEnabled = clipboardData.contentType === 'file' && clipboardData.content.length > 0;
            
            return   [
            {
                label: "New File...",
                name: "new_file",
                click: () => {
                    let firstFileIndex = folderItems.findIndex(
                        (a) => a.isFolder === false,
                    );
    
                    folderItems = [
                        ...folderItems.slice(0, firstFileIndex),
                        {
                            name: "",
                            full_path: path.resolve(`${workspaceDirectory}\\New File`),
                            isFolder: false,
                            isStaging: true,
                            new: true,
                        },
                        ...folderItems.slice(firstFileIndex),
                    ];
    
                    file_explorer.cancelStaging = () => {
                        folderItems = [...folderItems.filter((a) => !a.new)];
                    };
                },
            },
            {
                label: "New Folder...",
                name: "new_folder",
                click: () => {
                    folderItems = [
                        {
                            name: "",
                            full_path: path.resolve(
                                `${workspaceDirectory}\\New Folder`,
                            ),
                            isFolder: true,
                            isStaging: true,
                            new: true,
                        },
                        ...folderItems,
                    ];
    
                    file_explorer.cancelStaging = () => {
                        folderItems = [...folderItems.filter((a) => !a.new)];
                    };
                },
            },
            {
                label: "Reveal in File Explorer",
                name: "reveal_in_file_explorer",
                click: () => {
                    child_process.exec(`explorer /select, ${full_path}`)
                }
            },
            {
                label: "Open in Integrated Terminal",
                name: "open_in_integrated_terminal",
            },
            {
                separator: true,
            },
            {
                label: "Add Folder to Workspace...",
                name: "add_folder_to_workspace",
            },
            {
                label: "Open Folder Settings",
                name: "open_folder_settings",
            },
            {
                label: "Remove Folder from Workspace",
                name: "remove_folder_from_workspace",
            },
            {
                separator: true,
            },
            {
                label: "Find in Folder...",
                name: "find_in_folder",
            },
            {
                label: "Paste",
                name: "paste",
                disabled: !isPasteEnabled,
                click: () => {
                    let itemsToSelect = [workspaceDirectory]

                    clipboardHelper.sendCommand('paste', {
                        file_explorer: true,
                        files: itemsToSelect
                    }).then(a => {
                        if(false){
                            console.log(a);
                        }
                    });
                }
            },
            {
                separator: true,
            },
            {
                label: "Copy Path",
                name: "copy_path",
            },
            {
                label: "Copy Relative Path",
                name: "copy_relative_path",
            },
            ];
        });
    }

    const sortItems = (tempFolderItems) => {
        let res = file_explorer.sortDirectories(tempFolderItems);
        folderItems = [...res];
    };

    const handleContextMenu = (ev) => {

        if (ev.altKey) {
        } else {
            ev.preventDefault();

            targetlessMenu().then(targetlessMenuLoaded => {

                let _end = new Date();

                menu({
                    x: ev.clientX,
                    y: ev.clientY,
                    shouldBlur: true,
                    options: targetlessMenuLoaded,
                });
            });
        }
    };

    const scan = () => {
        lastRescanned = new Date();

        if (path.extname(workspaceDirectory)) {
        } else {
            let sortedItems = file_explorer.sortDirectories(
                (file_explorer.folders[workspaceDirectory] || { children: [] })
                    .children,
            );
            folderItems = sortedItems;
        }
    };

    file_explorer.rescan = scan;

    onMount(() => {
        window.SCANNER = scan;

        scan();

        // setTimeout(() => {
        //     file_explorer.refreshTime = 10;
        // }, 100);

        let treeChangeEvent = (ev) => {
            let eventDetails = ev;

            if (eventDetails.parentDir === workspaceDirectory) {
                if (eventDetails.create) {
                    let elementToPush = eventDetails.element;

                    folderItems = [
                        ...folderItems.slice(0, eventDetails.index),
                        elementToPush,
                        ...folderItems.slice(eventDetails.index),
                    ];
                } else {
                    folderItems = [
                        ...folderItems.slice(0, eventDetails.index),
                        ...folderItems.slice(eventDetails.index + 1),
                    ];

                    console.log(folderItems);
                }
            }
        };

        file_explorer.itemEvents[workspaceDirectory] = {
            childrenRerender: treeChangeEvent
        }

        // document.addEventListener("tree_changed", treeChangeEvent);

        document.addEventListener("keyboard_shortcut.file_explorer", (ev) => {
            let action = ev.detail.functionName;

            switch (action) {
                case "paste": 
                case "new_file":
                case "new_folder":
                    if (
                        file_explorer.hoveredItem == undefined &&
                        !file_explorer.grayedOut
                    ) {
                        targetlessMenu().then(targetlessMenuLoaded => {
                            let funcConfig = targetlessMenuLoaded.find(
                                (op) => op.name == action,
                            );

                            funcConfig.click();
                        })
                    }
                break;
            }
        });
    });
</script>

<div
    class="current-directory tab-body {isExpanded ? 'expanded' : 'colapsed'}"
    on:contextmenu={handleContextMenu}
>
    {#each folderItems as singleItemProps, index (singleItemProps.full_path)}
        <SingleFolderItem
            bind:isFolder={singleItemProps.isFolder}
            bind:full_path={singleItemProps.full_path}
            bind:isStaging={singleItemProps.isStaging}
            bind:_new={singleItemProps.new}
            bind:_name={singleItemProps.name}
            bind:children={singleItemProps.children}
            level={0}
            parentIsExpanded={isExpanded}
            {index}
            entityDirectory={singleItemProps.name}
        />
    {/each}
</div>

<style>
    .colapsed {
        display: none;
    }
</style>
