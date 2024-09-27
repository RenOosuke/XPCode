<script>
    export let properties;
    export let level;
    
    let isExpanded = false;

    let {} = properties;
    let iconProps = iconManager.getIconForPath(properties.full_path);
    
    if(!properties.isFolder) {

    }

    const handleExpansionToggle = (ev) => {
        ev.stopPropagation();
        isExpanded = !isExpanded;
    }
</script>


<div class="single-folder-item {isExpanded ? 'expanded' : ''}">
    <div class="header-part" style="padding-left: {1 + level*.7}rem;" on:click={handleExpansionToggle}>
        <div class="left-side">
            {#if properties.isFolder}
                <div class="arrow-placeholder">
                    <div style="-webkit-mask-size: 1rem;" class="arrow-icon">
                    </div>
                </div>
            {:else}
                <div class="file-icon-placeholder {iconProps}">
                </div>
            {/if}

            <div class="directory-name">
                {properties.name}
            </div>
        </div>
    </div>

    {#if isExpanded && properties.children}
        {#each properties.children as singleItemProps}
            <svelte:self properties={singleItemProps} level={level+1}/>
        {/each}
    {/if}
</div>


<style>
    .arrow-icon {
        background-color: var(--sidebar-inactive-icon);
        height: 1rem;
        width: 1rem;
        margin-right: .2rem;
        margin-top: auto;
        margin-bottom: auto;
    }

    .arrow-icon {
        -webkit-mask: var(--chevron-right-icon);
    }
    
    .expanded > .header-part > .left-side > .arrow-placeholder > .arrow-icon {
        -webkit-mask: var(--chevron-down-icon);
    }

    .header-part {
        display: flex;
        padding: .1rem 0;
        min-height: 1rem;
        /* margin-bottom: .1rem; */
    }

    .header-part:hover {
        background-color: #2a2d2e;
        cursor: pointer;
    }

    .left-side {
        display: flex;
    }

    .arrow-placeholder {
        display: flex;
    }

    .file-icon-placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .file-icon-placeholder::before {
        font-family: 'Seti_Icon';
        background-image: unset;
        font-size: 130%;
    }

    .directory-name {
        line-height: 1.3;
    }

    /* .single-folder-item {
        display: flex;
        flex-direction: column;
    } */
</style>