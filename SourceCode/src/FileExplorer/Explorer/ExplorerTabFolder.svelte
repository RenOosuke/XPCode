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
</style>