<script>
    import { onMount } from "svelte";
  import FileExplorerHeader from "../FileExplorer/FileExplorerHeader.svelte";
  import FileExplorerBody from "../FileExplorer/FileExplorerBody.svelte";

    const backgroundColor = '#181818';
    const color = '#cccccc';
    const borderColor = '#2b2b2b';

    let activeTab = sidebarTabs.activeTab;
    
    document.addEventListener('sidebar_tab_changed', () => {
        activeTab = sidebarTabs.activeTab;
    });

    onMount(() => {
    })
</script>


<div class="file_explorer" style="background: {backgroundColor}; color: {color}; border-color: {borderColor};" id="unselectable" on:selectstart={(e) => e.preventDefault()}>
    <FileExplorerHeader {activeTab}></FileExplorerHeader>
    <FileExplorerBody {activeTab}></FileExplorerBody>
</div>


<style>
    .file_explorer {
        height: 100%;
        width: 30rem;
        border-right: solid 1px;
        display: flex;
        flex-direction: column;
    }
</style>