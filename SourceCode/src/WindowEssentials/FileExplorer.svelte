<script>
/**FileExplorer.svelte*/
import { onMount } from "svelte";
  import FileExplorerHeader from "../FileExplorer/FileExplorerHeader.svelte";
  import FileExplorerBody from "../FileExplorer/FileExplorerBody.svelte";
    import ResizeableBorder from "./ResizeableBorder.svelte";
    import { init } from "svelte/internal";
    const backgroundColor = '#181818';
    const color = '#cccccc';
    const borderColor = '#2b2b2b';
    let tabCSSVariableName = '--side-tab-offset';
    let activeTab = sidebarTabs.activeTab;
    
    document.addEventListener('sidebar_tab_changed', () => {
        activeTab = sidebarTabs.activeTab;
    });

    onMount(() => {
    })

    let initialOffset = 0;

    const handleResizing = (newDistance) => {
        initialOffset += newDistance;
        themeUtils.setProperty(tabCSSVariableName, `${initialOffset}px`);
    }

    onMount(() => {
        initialOffset = parseInt(settings.section.get('variables.explorer.x_offset'));
    })
</script>


<div class="file_explorer" style="background: {backgroundColor}; color: {color}; border-color: {borderColor};" id="unselectable" on:selectstart={(e) => e.preventDefault()}>
    <FileExplorerHeader {activeTab}></FileExplorerHeader>
    <FileExplorerBody {activeTab}></FileExplorerBody>
    <ResizeableBorder borders={{
        // top: true,
        right: true
    }} {handleResizing}></ResizeableBorder>
</div>


<style>
    .file_explorer {
        height: 100%;
        width: calc(30rem + var(--side-tab-offset));
        min-width: 10rem;
        border-right: solid 1px;
        display: flex;
        flex-direction: column;
        position: relative;
    }
</style>