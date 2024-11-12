<script>
    import ResizeableBorder from "../WindowEssentials/ResizeableBorder.svelte";

    // TEMP_HARDCODE
    const backgroundColor = 'var(--primary-dark-bg)';
    const color = '#cccccc';
    const borderColor = '#2b2b2b';

    let initialOffset = 0;

    const handleResizing = (newDistance) => {
        initialOffset -= newDistance;

        themeUtils.setProperty('--terminal-y-offset', `${initialOffset}px`);
    }
</script>


<div class="integrated_terminal" style="background: {backgroundColor}; color: {color}; border-color: {borderColor};">
    <ResizeableBorder borders={{
        top: true
    }} {handleResizing}></ResizeableBorder>
</div>

<style>
    .integrated_terminal {
        width: 100%;
        height: calc(30rem + var(--terminal-y-offset));
        border-top: solid 1px;
        position: relative;
    }
</style>