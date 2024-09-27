<script>
    export let properties;
    export let level;

    let {} = properties;
    let iconProps = iconManager.getIconForPath(properties.full_path);
    
    if(!properties.isFolder) {

    }
</script>


<div class="single-folder-item">
    <div class="header-part" style="padding-left: {1 + level*.1}rem;">
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
    
    .expanded .arrow-icon {
        -webkit-mask: var(--chevron-down-icon);
    }

    .header-part {
        display: flex;
        padding: .1rem 0;
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
</style>