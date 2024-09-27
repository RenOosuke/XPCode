<script>
  import ExplorerTabFolder from "./Explorer/ExplorerTabFolder.svelte";
  import ExplorerTabNpmScripts from "./Explorer/ExplorerTabNPMScripts.svelte";
  import ExplorerTabOpenEditors from "./Explorer/ExplorerTabOpenEditors.svelte";
  import ExplorerTabOutline from "./Explorer/ExplorerTabOutline.svelte";
  import ExplorerTabTimeline from "./Explorer/ExplorerTabTimeline.svelte";
import GenericExplorerTab from "./Explorer/GenericExplorerTab.svelte";

    let tabsToShow = [
        'active',
        'folder',
        'outline',
        'timeline',
        'npm',
    ];

    let contentMapping = {
        active: ExplorerTabOpenEditors,
        folder: ExplorerTabFolder,
        outline: ExplorerTabOutline,
        timeline: ExplorerTabTimeline,
        npm: ExplorerTabNpmScripts
    }
</script>


<div class="explorer-tabs">
    {#each tabsToShow as singleTab}
        <GenericExplorerTab tabContent={contentMapping[singleTab]} tabName={singleTab}></GenericExplorerTab>
    {/each}
</div>

<style>
    .explorer-tabs {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>