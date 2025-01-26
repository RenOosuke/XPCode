<script>
    import { onMount } from "svelte";

    export let outlineItem;
    export let index;
    export let parentIsExpanded;
    export let level = 0;
    export let selectedStart = undefined;
    export let hoveredStart = undefined;

    let isExpanded = false;
    let _name = outlineItem.name;
    let shouldFocusTreeLine = false;

    $: {
        if(outlineItem.items && parentIsExpanded && (hoveredStart || selectedStart)) {
            shouldFocusTreeLine = !!outlineItem.items.find(item => (item.start == hoveredStart || item.start == selectedStart));
        }
    }

    const handleArrowClick = (ev, expandedValue) => {
        if(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        if(expandedValue !== undefined) {
            isExpanded = expandedValue;
        } else {
            isExpanded = !isExpanded;
        }

        outline.expanded[outlineItem.start] = isExpanded;
        outline.hoveredItem.set(outlineItem.start);
        shortcuts.rerenderOutline()
    }

    const handleExpansionToggle = (ev) => {
        if(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        if(outlineItem.items) {
            isExpanded = !isExpanded;

            outline.expanded[outlineItem.start] = isExpanded;
        }

        outline.hoveredItem.set(outlineItem.start);
        outline.selectedItem.set(outlineItem.start);
        TODO("Point to the specific code line when an outline item gets selected");
        outline.grayedOut = false;
        file_explorer.grayedOut = true;
        themeUtils.setGrayedOut();

        shortcuts.rerenderOutline()
    }

    onMount(() => {
        if(outlineItem.items) {
            outline.expansion[outlineItem.start] = handleArrowClick;
            outline.expanded[outlineItem.start] = false;
        } else {
            outline.expansion[outlineItem.start] = handleExpansionToggle;
        }
    })
</script>

<div
    class="single_outline_item index{index} {isExpanded
        ? 'expanded'
        : ''}{parentIsExpanded ? '' : ' parent-colapsed'} {selectedStart == outlineItem.start
        ? 'item_selected'
        : ''}"
        _start = {outlineItem.start}
>
    <div
        class="header-part {hoveredStart == outlineItem.start ? ' _hovered' : ''}{selectedStart == outlineItem.start
            ? ' var-item-select-bg'
            : ''}"
        style="padding-left: {.3 + level * 0.7}rem;"
        on:click={handleExpansionToggle}
        id={"unselectable"}
    >
        <div class="left-side">            
            
            {#if outlineItem.items}
            <div class="arrow-placeholder" on:click={handleArrowClick}>
                <div
                style="-webkit-mask-size: 1rem;"
                class="arrow-icon var-chevron-right-icon var-sidebar-inactive-icon"
                ></div>
            </div>
            {:else}
            <div class="empty-arrow">
                
            </div>
            {/if}
            
            <div class="file-icon-placeholder _outline_{outlineItem.type}"></div>

            <div class="item_name">
                {_name}
            </div>

            {#if outlineItem.value}
                <div class="value">
                    {outlineItem.value}
                </div>
            {/if}
        </div>
    </div>

    {#if outlineItem.items}
        {#each outlineItem.items as childItem, childIndex (childItem.start)}
            <svelte:self
                level={level + 1}
                parentIsExpanded={isExpanded}
                index={childIndex}
                selectedStart={selectedStart}
                hoveredStart={hoveredStart}
                outlineItem={childItem}
            />
        {/each}
    {/if}

    {#if outlineItem.items && isExpanded}
        <div
            class="tree-line var-tree-line {shouldFocusTreeLine ? 'tree_focused var-focused-tree-line' : ''}"
            style="left: {.95 + level * 0.7}rem;"
        ></div>
    {/if}
</div>

<style>
    .arrow-icon {
        height: 1rem;
        width: 1rem;
        margin-right: 0.2rem;
        margin-top: auto;
        margin-bottom: auto;
    }

    .header-part {
        display: flex;
        padding: 0.1rem 0;
        min-height: 1rem;
        /* margin-bottom: .1rem; */
        cursor: pointer !important;
        border: solid 1px transparent;
        position: relative;
    }

    .header-part:hover:not(._hovered):not(.var-item-select-bg) {
        cursor: pointer;
    }

    .left-side {
        display: flex;
        width: -webkit-fill-available;
    }

    .arrow-placeholder {
        display: flex;
        width: 1.2rem;
        margin-left: 0.17rem;
    }

    .file-icon-placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 0.15rem;
    }

    .file-icon-placeholder::before {
        font-family: "codicon";
        background-image: unset;
        font-size: 110%;
        width: 1.2rem;
        margin-right: .3rem;
    }

    .item_name, .value {
        line-height: 1.2;
        font-size: 0.8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-bottom: 0.05rem;
    }

    .value {
        opacity: .7;
        margin-left: .5rem;
    }
    
    .parent-colapsed {
        display: none;
    }

    .single_outline_item {
        position: relative;
    }

    :global(
            .explorer-tab-header.outline.grayed-out
                + .current_outline
                ._hovered
        ) {
        border: solid 1px transparent !important;
    }

    .tree-line {
        height: calc(100% - 1.4rem);
        /* height: calc(100% + .2rem); */
        width: 1px;
        position: absolute;
        z-index: 1000;
        top: 1.4rem;
        /* top: 50%; */
        /* transform: translate(0, -50%); */
    }

    .tree-line.tree_focused {
        border-left: solid 1px !important;
    }

    .empty-arrow {
        width: 1.2rem;
        height: 2px;
        background: none;
    }

    ._outline_class::before {
        font-size: 100% !important;
    }
</style>
