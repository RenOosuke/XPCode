<script>
  import { onMount } from "svelte";
  import SingleFolderItem from "./Folder/SingleFolderItem.svelte";
  export let isExpanded;

    let folderItems = [];
    let lastRescanned;

    const rerenderEvent = (directoryEl) => {
        let directoriesInPath = directoryEl.full_path.split('\\').length;
        let directoriesInLaunchPath = launchArguments.full_path.split('\\').length;
        let level = directoriesInPath - directoriesInLaunchPath;
        console.log(level);
    };
    
    const targetlessMenu = [
        {
            label: "New File...",
            name: "new_file",
            click: () => {
                let firstFileIndex = folderItems.findIndex(a => a.isFolder === false);

                folderItems = [
                    ...folderItems.slice(0, firstFileIndex),
                    {
                        name: '',
                        full_path: path.resolve(`${launchArguments}\\New File`),
                        isFolder: false,
                        isStaging: true,
                        new: true
                    },
                    ...folderItems.slice(firstFileIndex)
                ]

                file_explorer.cancelStaging = () => {
                    folderItems = [...folderItems.filter(a => !a.new)]
                }
            }
        },
        {
            label: "New Folder...",
            name: "new_folder",
            click: () => {
                folderItems = [
                    {
                        name: '',
                        full_path: path.resolve(`${launchArguments}\\New Folder`),
                        isFolder: true,
                        isStaging: true,
                        new: true
                    },
                    ...folderItems
                ]

                file_explorer.cancelStaging = () => {
                    folderItems = [...folderItems.filter(a => !a.new)]
                }
            }
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
            label: "Add Folder to Workspace...",
            name: "add_folder_to_workspace"
        },
        {
            label: "Open Folder Settings",
            name: "open_folder_settings"
        },
        {
            label: "Remove Folder from Workspace",
            name: "remove_folder_from_workspace"
        },
        {
            separator: true
        },
        {
            label: "Find in Folder...",
            name: "find_in_folder"
        },
        {
            label: "Paste",
            name: "paste"
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
        }
    ];

    const sortItems = (tempFolderItems) => {
        console.log(tempFolderItems[tempFolderItems.length-1]);
        let res = file_explorer.sortDirectories(tempFolderItems);
        folderItems = [...res];
    }

    const handleContextMenu = (ev) => {
        if(ev.altKey) {
        } else {
            ev.preventDefault();
            menu({
                x: ev.clientX,
                y: ev.clientY,
                shouldBlur: true,
                options: targetlessMenu,
            });
            console.log(ev);
        }
    };

    const scan = () => {
        lastRescanned = new Date();

        if(path.extname(launchArguments)) {

        } else {
            let sortedItems = file_explorer.sortDirectories(file_explorer.folders[launchArguments].children);
            console.log(sortedItems);
            folderItems = sortedItems;
        }
    }

    
    file_explorer.rescan = scan;
    
    onMount(() => {
        window.SCANNER = scan;
        console.log('MOUNTED');

        scan();

        let treeChangeEvent = (ev) => {
            let eventDetails = ev.detail;
            // scan();
            console.log(ev);
            if(eventDetails.parentDir === launchArguments) {
                if(eventDetails.create) {
                    let elementToPush = eventDetails.element;

                    folderItems = [
                        ...folderItems.slice(0, eventDetails.index),
                        elementToPush,
                        ...folderItems.slice(eventDetails.index)
                    ];
                } else {
                    folderItems = [
                        ...folderItems.slice(0, eventDetails.index),
                        ...folderItems.slice(eventDetails.index+1)
                    ]

                    console.log(folderItems);
                }
            }
        }

        document.addEventListener('tree_changed', treeChangeEvent);
    }) 
</script>


<div class="current-directory {isExpanded ? 'expanded' : 'colapsed'}" on:contextmenu={handleContextMenu}>
    {#each folderItems as singleItemProps, index}
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
    .current-directory {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    ::-webkit-scrollbar {
        width: .8rem;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(77, 77, 77, .5);
        /* opacity: 50%; */
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgba(77, 77, 77, 1);
        /* opacity: 100%; */
    }

    .colapsed {
        display: none;
    }
</style>