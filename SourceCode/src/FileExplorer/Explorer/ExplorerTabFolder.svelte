<script>
  import { onMount } from "svelte";
  import SingleFolderItem from "./Folder/SingleFolderItem.svelte";
  export let isExpanded;

    let folderItems = [];

    const targetlessMenu = [
        {
            label: "New File...",
            name: "new_file"
        },
        {
            label: "New Folder...",
            name: "new_folder"
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

    onMount(() => {
        file_explorer.getFilesInDirectory(launchArguments).then(a => {
            let currentDir = a[0];
            let tempFolderItems;

            console.log(currentDir)
            if(currentDir.isFolder) {
                tempFolderItems = currentDir.children;
            } else {
                tempFolderItems = a;
            }

            tempFolderItems = file_explorer.sortDirectories(tempFolderItems);

            folderItems = tempFolderItems;

            console.log(folderItems)
        });

    }) 
</script>


<div class="current-directory {isExpanded ? 'expanded' : 'colapsed'}" on:contextmenu={handleContextMenu}>
    {#each folderItems as singleItemProps}
        <SingleFolderItem properties={singleItemProps} level={0} parentIsExpanded={isExpanded}></SingleFolderItem>
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