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
        document.addEventListener(ACTIVE_ELEMENT_CHANGED, () => {
            file_explorer.tabSizing.update();

            setTimeout(() => {
                currentActiveItem = file_explorer.activeItem;
    
                activeElementPresent = !!currentActiveItem;
    
                if(activeElementPresent) {
                    outlineItems = outline.getOutline(currentActiveItem) || [];
                    fileName = path.basename(currentActiveItem);
                    console.log(outlineItems);
                } else {
                    outlineItems = [];
                    fileName = '';
                }
    
                hasOutline = outlineItems.length > 0;
    
                TODO('Outline item whilst unsaved!');
            }, 50)
        });

        document.addEventListener(RERENDER_OUTLINE, () => {
            selectedStart = outline.selectedItem.get();
            hoveredStart = outline.hoveredItem.get();
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