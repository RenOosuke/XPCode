<script>
    import { onMount } from "svelte";
  import FileExplorerHeader from "../FileExplorer/FileExplorerHeader.svelte";

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


<div class="file_explorer" style="background: {backgroundColor}; color: {color}; border-color: {borderColor};">
    <FileExplorerHeader {activeTab}></FileExplorerHeader>
</div>


<style>
    .file_explorer {
        height: 100%;
        width: 30rem;
        border-right: solid 1px;
    }
</style>