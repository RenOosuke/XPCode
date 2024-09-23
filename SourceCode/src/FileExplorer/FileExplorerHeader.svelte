<script>
    export let activeTab;

    let labelMapping = {
        'files': 'explorer',
        'search': 'search',
        'git': 'source control',
        'debug': 'run and debug',
    }

    let headerColor = 'color: rgb(204, 204, 204);'
    let iconsPath = themeUtils.iconsPath();
</script>


<div class="explorer_header">
    <div class="tab_title codicon codicon-view-more" style="{headerColor}">
        {labelMapping[activeTab] || ''}
    </div>

    {#if activeTab !== 'search'}
        <div class="tab_settings">
            <div class="icon-placeholder-more">
                <div class="header-icon more" style="-webkit-mask: var(--more-icon); -webkit-mask-size: 1rem;"></div>
            </div>
        </div>
    {:else}
    {/if}
</div>


<style>
    .explorer_header {
        padding: .3rem .7rem .3rem 1rem;
        display: flex;
        justify-content: space-between;
    }

    .tab_title {
        margin-top: .2rem;
        font-size: .7rem;
        text-transform: uppercase;
    }

    .more {
        height: 1rem;
        width: 1rem;
        background-color: var(--sidebar-inactive-icon);
    }

    .icon-placeholder-more {
        padding: .15rem;
        border-radius: .2rem;
    }

    .icon-placeholder-more:hover{
        background-color: #2d2e2e;
        cursor: pointer;
    }
</style>