<script>
    import { onMount } from "svelte";
    export let isExpanded;

    let activeElementPresent = false;
    let hasHistory = false;
    let historyItems = [];
    let currentActiveItem = undefined;
    onMount(() => {
        document.addEventListener(ACTIVE_ELEMENT_CHANGED, () => {
            currentActiveItem = file_explorer.activeItem;

            activeElementPresent = !!currentActiveItem;
            
            TODO('Timeline items not yet implemented!');
        });
    })
</script>


<div class="tab-body" style="{isExpanded ? '' : 'display: none;'}">
    {#if activeElementPresent}
        {#if hasHistory}
                {#each historyItems as historyItem}
                    <div>

                    </div>
                {/each}
            {:else}
            <div class="no_history var-timeline-tip-color">
                Local History will track recent changes as you save them unless the file has been excluded or is too large.
            </div>
        {/if}
    {:else}
        <div class="no_item var-timeline-tip-color">
            The active editor cannot provide timeline information.
        </div>
    {/if}
</div>


<style>
    .no_item, .no_history {
        padding-left: 1.2rem;
        padding-right: 1.2rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }


</style>