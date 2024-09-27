<script>
  import { onMount } from "svelte";
  import SingleFolderItem from "./Folder/SingleFolderItem.svelte";
    let folderItems = [];

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


<div class="current-directory">
    {#each folderItems as singleItemProps}
        <SingleFolderItem properties={singleItemProps} level={0}></SingleFolderItem>
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
</style>