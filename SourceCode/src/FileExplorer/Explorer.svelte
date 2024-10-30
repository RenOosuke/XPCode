<script>
  import ExplorerTabFolder from "./Explorer/ExplorerTabFolder.svelte";
  import ExplorerTabNpmScripts from "./Explorer/ExplorerTabNPMScripts.svelte";
  import ExplorerTabOpenEditors from "./Explorer/ExplorerTabOpenEditors.svelte";
  import ExplorerTabOutline from "./Explorer/ExplorerTabOutline.svelte";
  import ExplorerTabTimeline from "./Explorer/ExplorerTabTimeline.svelte";
import GenericExplorerTab from "./Explorer/GenericExplorerTab.svelte";
    export let activeTab;

    let tabsToShow = [
        'active',
        'folder',
        'outline',
        'timeline',
        'npm scripts',
    ];

    let contentMapping = {
        active: ExplorerTabOpenEditors,
        folder: ExplorerTabFolder,
        outline: ExplorerTabOutline,
        timeline: ExplorerTabTimeline,
        'npm scripts': ExplorerTabNpmScripts
    }

    let tabButtons = {
        active: [
            {
                icon: 'new-file',
                title: 'New Untitled Text File'
            },
            {
                icon: 'save-all',
                title: 'Save All'
            },
            {
                icon: 'close-all-editors',
                title: 'Close All Editors'
            }
        ],
        folder: [
            {
                icon: 'new-file',
                title: 'New File...'
            },
            {
                icon: 'new-folder',
                title: 'New Folder...'
            },
            {
                icon: 'refresh',
                title: 'Refresh Explorer'
            },
            {
                icon: 'collapse-all',
                title: 'Collapse Folders in Explorer'
            }
        ],
        outline: [
            {
                icon: 'collapse-all',
                title: 'Collapse All'
            },
            {
                icon: 'more',
                title: 'More Actions...'
            },
        ],
        timeline: [
            {
                icon: 'pin',
                title: 'Pin The Current Timeline'
            },
            {
                icon: 'refresh',
                title: 'Refresh'
            },
            {
                icon: 'filter',
                title: 'Filter Timeline'
            },
            {
                icon: 'more',
                title: 'More Actions...'
            }
        ],
        'npm scripts': [
            {
                icon: 'refresh',
                title: 'Refresh'
            },
            {
                icon: 'collapse-all',
                title: 'Collapse All'
            },
        ]
    }
</script>


<div class="explorer-tabs {activeTab === 'files' ? '' : 'hide'}">
    {#each tabsToShow as singleTab}
        <GenericExplorerTab tabContent={contentMapping[singleTab]} tabName={singleTab} tabButtons={tabButtons[singleTab]}></GenericExplorerTab>
    {/each}
</div>

<style>
    .explorer-tabs {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .hide {
        display: none;
    }
</style>