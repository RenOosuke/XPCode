<script>
  import { onMount } from "svelte";

    let iconsPath = themeUtils.iconsPath();
    let maskSize = `-webkit-mask-size: 1.1rem !important;`;

    const windowPromptQuit = () => {
        let hasUnsavedFiles = false; // TODO
        
        if(!hasUnsavedFiles) {
            nw.App.quit();
        }
    }

    let isFullScreen = screenControls.isFullScreen();

    onMount(() => {
        document.addEventListener('nw_custom_resize', () => {
            isFullScreen = screenControls.isFullScreen();
        });
    })
</script>


<div class="dragbar_right">
    <div class="window_layout_control">

    </div>

    <div class="window_control">
        <div class="icon_placeholder">
            <div class="window_control_icon icon minimize" style="-webkit-mask: url('{`${iconsPath}/minimise.svg`}') no-repeat center; {maskSize}" on:click={() => screenControls.nwWindow.minimize()}></div>
        </div>

        {#if isFullScreen}
            <div class="icon_placeholder">
                <div class="window_control_icon icon restore" style="-webkit-mask: url('{`${iconsPath}/off_fullscreen.svg`}') no-repeat center; {maskSize}" on:click={() => screenControls.nwWindow.unmaximize()}></div>
            </div>
        {:else}
            <div class="icon_placeholder">
                <div class="window_control_icon icon fullscreen" style="-webkit-mask: url('{`${iconsPath}/fullscreen.svg`}') no-repeat center; {maskSize}" on:click={() => screenControls.nwWindow.maximize()}></div>
            </div>
        {/if}


        <div class="icon_placeholder" on:click={() => windowPromptQuit()}>
            <div class="window_control_icon icon close" style="-webkit-mask: url('{`${iconsPath}/close.svg`}') no-repeat center; {maskSize}"></div>
        </div>
    </div>
</div>

<style>
    .dragbar_right {
        display: flex;
    }

    .window_control {
        display: flex;
        height: 100%;
    }

    .icon {
        width: 1.1rem;
        height: 1.1rem;
        padding: .3rem .75rem;
    }

    .icon:not(.innactive) {
        background-color: var(--sidebar-inactive-icon);
    }

    .icon_placeholder {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .icon_placeholder:hover {
        background-color: #373737;
    }
</style>