<script>
    import { L } from "../../src-noconflict/ace";
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
                title: 'Collapse All',
                click: () => {
                    let expandedItems = Object.keys(outline.expanded);
                    let hasExpanded = Object.values(outline.expanded).find(a => a);

                    expandedItems.forEach((key) => {
                        outline.expansion[key](undefined, !hasExpanded);
                    })
                }
            },
            {
                icon: 'more',
                title: 'More Actions...',
                click: (ev) => {
                    let x = ev.x;
                    let y = ev.y;

                    let selectedSort = settings.get(SETTINGS_SORT_PATH);
                    let sortByPosition = "sort_outline_by_position";
                    let sortByName = "sort_outline_by_name";
                    let sortByCategory = "sort_outline_by_category";

                    let genericClick = (sortName) => () => {
                        settings.section.set(SETTINGS_SORT_PATH, `"${sortName}"`);
                        
                        document.dispatchEvent(new CustomEvent(ACTIVE_ELEMENT_CHANGED, {
                            detail: sortName
                        }));
                    };

                    /** @type {singleMenuItem[]}*/
                    let config = 
                    [
                        {
                            label: 'Sort By: Position',
                            name: sortByPosition,
                            icon_prefix: true,
                            toggled: sortByPosition == selectedSort,
                            click: genericClick(sortByPosition)
                        },
                        {
                            label: 'Sort By: Name',
                            name: 'sort_outline_by_name',
                            icon_prefix: true,
                            toggled: sortByName == selectedSort,
                            click: genericClick(sortByName)
                        },
                        {
                            label: 'Sort By: Category',
                            name: 'sort_outline_by_category',
                            icon_prefix: true,
                            toggled: sortByCategory == selectedSort,
                            click: genericClick(sortByCategory)
                        },
                    ];

                    menu({
                        options: config,
                        x,
                        y
                    });
                }
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
    {#each tabsToShow as singleTab (singleTab)}
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