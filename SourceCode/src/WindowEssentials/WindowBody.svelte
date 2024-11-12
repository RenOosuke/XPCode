<script>
    /**WindowBody.svelte*/
import CodeEditorRegion from "./CodeEditorRegion.svelte";
import FileExplorer from "./FileExplorer.svelte";
import SideBar from "./SideBar.svelte";

</script>


<div class="window-body">
    <SideBar></SideBar>
    <FileExplorer></FileExplorer>
    <CodeEditorRegion></CodeEditorRegion>
</div>

<style>
    .window-body {
        display: flex;
        height: 100%;
    }
</style>