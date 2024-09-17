<script>
    let iconsPath = themeUtils.iconsPath();
    let maskSize = `-webkit-mask-size: 1.1rem !important;`;
</script>


<div class="dragbar_right">
    <div class="window_layout_control">

    </div>

    <div class="window_control">
        <div class="icon_placeholder">
            <div class="window_control_icon icon minimize" style="-webkit-mask: url('{`${iconsPath}/minimise.svg`}') no-repeat center; {maskSize}"></div>
        </div>

        <div class="icon_placeholder">
            <div class="window_control_icon icon restore" style="-webkit-mask: url('{`${iconsPath}/off_fullscreen.svg`}') no-repeat center; {maskSize}"></div>
        </div>

        <div class="icon_placeholder">
            <div class="window_control_icon icon fullscreen" style="-webkit-mask: url('{`${iconsPath}/fullscreen.svg`}') no-repeat center; {maskSize}"></div>
        </div>

        <div class="icon_placeholder">
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
        padding: .3rem .5rem;
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