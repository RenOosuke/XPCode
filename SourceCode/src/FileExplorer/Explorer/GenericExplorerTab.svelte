<script>
    let isExpanded = false;
    export let tabName;
    export let tabButtons;
    export let tabContent

    const handleTabClick = (ev) => {
        isExpanded = !isExpanded;
    }
</script>


<div class="explorer-tab {isExpanded ? 'expanded' : ''}">
    <div class="explorer-tab-header" on:click={handleTabClick}>
        <div class="left-side">
            <div class="arrow-placeholder">
                <div style="-webkit-mask-size: 1rem;" class="arrow-icon">
                    <!-- -webkit-mask: var(--{isExpanded ? 'chevron-down' : 'chevron-right'}-icon);  -->
                </div>
            </div>
    
            <div class="explorer-tab-name">
                {tabName}
            </div>
        </div>

        <div class="right-side">
           <!---ADD THE BUTTONS HERE AFTERWARDS--> 
        </div>
    </div>

    {#if isExpanded}
        <svelte:component this={tabContent}/>
    {/if}
</div>


<style>
    .arrow-icon {
        background-color: var(--sidebar-inactive-icon);
        height: 1rem;
        width: 1rem;
        margin-right: .2rem;
    }

    .explorer-tab-header {
        display: flex;
        justify-content: space-between;
        margin: .2rem 0;
        cursor: pointer;
        padding-bottom: .15rem;
        padding-top: .05rem;
        border: solid 1px;
        border-top-color: transparent !important;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        /* border-color: #2b2b2b; */
        border-bottom-color: #2b2b2b;
    }

    .explorer-tab-header:active {
        border: solid 1px #0078d4 !important;
    }
   
    /* .explorer-tab:first-child .explorer-tab-header {
        border-top-color: transparent;
    } */

    .explorer-tab:last-child .explorer-tab-header {
        border-bottom-color: transparent;
    }

    .explorer-tab-header {

    }

    .arrow-icon {
        -webkit-mask: var(--chevron-right-icon);
    }
    
    .expanded .arrow-icon {
        -webkit-mask: var(--chevron-down-icon);
    }

    .expanded .explorer-tab-header {
        border-bottom-color: transparent;
        /* border-color: #2b2b2b; */
    }

    .left-side {
        display: flex;
        text-transform: uppercase;
        font-size: .7rem;
        font-weight: 700;
    }

    .expanded {
        flex-grow: 1;
    }
</style>