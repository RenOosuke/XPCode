<script>
    import { onMount } from "svelte";
    import SingleOutlineItem from "./Outline/SingleOutlineItem.svelte";

    export let isExpanded;
    let activeElementPresent = false;
    let hasOutline = false;
    let outlineItems = [];
    let currentActiveItem = undefined;
    let fileName = ``;
    let selectedStart = undefined;
    let hoveredStart = undefined;

    onMount(() => {
        document.addEventListener(ACTIVE_ELEMENT_CHANGED, (ev) => {
            file_explorer.tabSizing.update();
            
            currentActiveItem = file_explorer.activeItem;

            activeElementPresent = !!currentActiveItem;

            let categoryOrder = {
                class: 0,
                function: 1,
                property: 2,
                variable: 3,
                method: 4,
                property: 5,
                module: 6,
                string: 7,
                number: 8,
                boolean: 9,
            };

            let sortingFunctions = {
                sort_outline_by_position: (itemA, itemB) => {
                    return itemA.start - itemB.start;
                },

                sort_outline_by_name: (itemA, itemB) => {
                    return itemA.name.localeCompare(itemB.name)
                },

                sort_outline_by_category: (itemA, itemB) => {
                    return categoryOrder[itemA.type] - categoryOrder[itemB.type];
                }
            }

            const resortOutlineItems = (sortName) => {
                let sortedOutlineItems = JSON.parse(JSON.stringify(outlineItems));
                let sortingFunction = sortingFunctions[sortName];

                let recursiveSort = (item) => {
                    if(item.items) {
                        item.items.forEach(recursiveSort);
                        item.items.sort(sortingFunction);
                    };
                }

                sortedOutlineItems.forEach(recursiveSort)
                sortedOutlineItems.sort(sortingFunction);

                outlineItems = sortedOutlineItems;
            }

            if(ev.detail) {
                resortOutlineItems(ev.detail);
            } else {
                if(activeElementPresent) {
                    outline.getOutline(currentActiveItem).then(_outlineItems => {
                        outlineItems = _outlineItems || [];
                        hasOutline = outlineItems.length > 0;
                        resortOutlineItems(settings.section.get(SETTINGS_SORT_PATH));
                    });
    
                    fileName = path.basename(currentActiveItem);
                } else {
                    outlineItems = [];
                    fileName = '';
                    hasOutline = false;
                }
            }

            TODO('Outline item whilst unsaved!');
        });

        document.addEventListener(RERENDER_OUTLINE, () => {
            selectedStart = outline.selectedItem.get();
            hoveredStart = outline.hoveredItem.get();
            // if(out)
        });
    })
</script>


<div class="tab-body current_outline" style="{isExpanded ? '' : 'display: none;'}">
    {#if activeElementPresent}
        {#if hasOutline}
                <div class="outline_list">
                    {#each outlineItems as outlineItem, i (outlineItem.start)}
                        <SingleOutlineItem {outlineItem} index={i} parentIsExpanded={isExpanded} level={0} {selectedStart} {hoveredStart}></SingleOutlineItem>
                    {/each}
                </div>
            {:else}
            <div class="no_history">
                No symbols found in document "{fileName}"
            </div>
        {/if}
    {:else}
        <div class="no_item">
            The active editor cannot provide outline information.
        </div>
    {/if}
</div>


<style>
    .no_item, .no_history {
        padding-left: 1.2rem;
        padding-right: 1.2rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        color: var(--timeline-tip-color);
    }


</style>