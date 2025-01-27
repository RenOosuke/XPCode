<script>
    import { onMount } from "svelte";
    import ResizeableBorder from "../WindowEssentials/ResizeableBorder.svelte";

    // TEMP_HARDCODE
    const color = '#cccccc';
    const borderColor = '#2b2b2b';

    let initialOffset = 0;
    let initialHeight;
    let terminalElement;
    let codeEditorRegionElement;
    let logoElement;

    const resizeFromOffset = () => {
        let rem = ElementUtils.getRemSize();

        let minSize = rem * .4;

        let calculatedHeight = Math.max((initialOffset + (rem * 30)), minSize);

        if(calculatedHeight < (10 * rem)) {
            if(calculatedHeight < (2*rem)) {
                calculatedHeight = minSize;                
            } else {
                calculatedHeight = 10 * rem;
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
    }

    const handleResizing = (newDistance) => {
        initialOffset -= newDistance;
 
        resizeFromOffset();
    }
    
    onMount(() => {
        terminalElement = jQuery(".integrated_terminal")[0];
        codeEditorRegionElement = jQuery(".code_editor_region")[0];
        logoElement = jQuery("img.logo")[0] || {style: {display: ''}};
    })
</script>


<div class="integrated_terminal var-primary-dark-bg" style="color: {color}; border-color: {borderColor};">
    <ResizeableBorder borders={{
        top: true
    }} {handleResizing}></ResizeableBorder>
</div>

<style>
    .integrated_terminal {
        width: 100%;
        height: 30rem;
        border-top: solid 1px;
        position: relative;
    }
</style>