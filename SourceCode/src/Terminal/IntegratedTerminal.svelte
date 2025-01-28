<script>
    import { onMount } from "svelte";
    import ResizeableBorder from "../WindowEssentials/ResizeableBorder.svelte";

    // TEMP_HARDCODE
    const color = '#cccccc';
    const borderColor = '#2b2b2b';

    let initialOffset = 0;
    let initialHeight = 0;
    let terminalElement;
    let codeEditorRegionElement;
    let logoElement;
    let firstResizingHasPassed = false;
    let _calculatedHeight;

    const resizeFromOffset = () => {
        let rem = ElementUtils.getRemSize();

        let hiddenTerminalHeight = rem * .4;
        let calculatedHeight = initialOffset + initialHeight;
        let bottomSnapLimit = 2*rem;
        let minHeight = 10 * rem;

        if(calculatedHeight < minHeight) {
            if(calculatedHeight < bottomSnapLimit) {
                calculatedHeight = hiddenTerminalHeight;                
            } else {
                calculatedHeight = minHeight;
            }
        };

        let codeEditorRegionHeight = codeEditorRegionElement.getBoundingClientRect().height;
        let heightBound = .95 * codeEditorRegionHeight;
        let heightSnapBound = .98 * codeEditorRegionHeight;

        if(calculatedHeight >= heightBound) {
            if(calculatedHeight >= heightSnapBound) {
                calculatedHeight = codeEditorRegionHeight;
                // if we're supposed to snap the terminal to the top, hide the logo
                logoElement.style.display = 'none';
            } else {
                calculatedHeight = heightBound;
                // if we're supposed to UNsnap the terminal from the top, return the logo
                logoElement.style.display = 'initial';
            }
        }

        terminalElement.style.setProperty("height", `${calculatedHeight}px`);
        _calculatedHeight = calculatedHeight;
    }

    const handleResizing = (newDistance) => {
        initialOffset -= newDistance;
        resizeFromOffset();
    }

    const onDragStart = () => {
        if(firstResizingHasPassed) {
            return;
        } else {
            firstResizingHasPassed = true;
        }
    
        initialHeight = terminalElement.getBoundingClientRect().height;
    };

    const onDragEnd = () => {
        initialOffset = _calculatedHeight - initialHeight;
    }
    
    onMount(() => {
        terminalElement = jQuery(".integrated_terminal")[0];
        codeEditorRegionElement = jQuery(".code_editor_region")[0];
        logoElement = jQuery(".logo.divimg")[0] || {style: {display: ''}};
    })
</script>


<div class="integrated_terminal var-primary-dark-bg" style="color: {color}; border-color: {borderColor};">
    <ResizeableBorder borders={{
        top: true
    }} {handleResizing} {onDragStart} {onDragEnd}></ResizeableBorder>
</div>

<style>
    .integrated_terminal {
        width: 100%;
        height: 22rem;
        border-top: solid 1px;
        position: relative;
    }
</style>