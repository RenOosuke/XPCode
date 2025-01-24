<script>
  import { onMount } from "svelte";

    let iconsPath = themeUtils.iconsPath();
    let maskSize = `-webkit-mask-size: 1.1rem !important;`;

    let isFullScreen = WindowManager.isFullScreen();

    onMount(() => {
        document.addEventListener('nw_custom_resize', () => {
            isFullScreen = WindowManager.isFullScreen();
        });
    })
</script>


<div class="dragbar_right">
    <div class="window_layout_control">

    </div>

    <div class="window_control">
        <div class="icon_placeholder">
            <div class="window_control_icon icon minimize" style="-webkit-mask: url('{`${iconsPath}/minimise.svg`}') no-repeat center; {maskSize}" on:click={() => WindowManager.minimize()}></div>
        </div>

        {#if isFullScreen}
            <div class="icon_placeholder">
                <div class="window_control_icon icon restore" style="-webkit-mask: url('{`${iconsPath}/off_fullscreen.svg`}') no-repeat center; {maskSize}" on:click={() => WindowManager.unmaximize()}></div>
            </div>
        {:else}
            <div class="icon_placeholder">
                <div class="window_control_icon icon fullscreen" style="-webkit-mask: url('{`${iconsPath}/fullscreen.svg`}') no-repeat center; {maskSize}" on:click={() => WindowManager.maximize()}></div>
            </div>
        {/if}


        <div class="icon_placeholder" on:click={() =>  WindowManager.windowPromptQuit()}>
            <div class="window_control_icon icon close" style="-webkit-mask: url('{`${iconsPath}/close.svg`}') no-repeat center; {maskSize}"></div>
        </div>
    </div>
</div>

<style>
    .dragbar_right {
        display: flex;
        flex: 0 0 auto; /* Prevents shrinking or growing */
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

    .icon_placeholder {
        height: -webkit-fill-available;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .icon_placeholder:hover {
        background-color: #373737;
    }
</style>