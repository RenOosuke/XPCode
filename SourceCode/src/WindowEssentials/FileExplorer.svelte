<script>
/**FileExplorer.svelte*/
import { onMount } from "svelte";
  import FileExplorerHeader from "../FileExplorer/FileExplorerHeader.svelte";
  import FileExplorerBody from "../FileExplorer/FileExplorerBody.svelte";
    import ResizeableBorder from "./ResizeableBorder.svelte";
    import { init } from "svelte/internal";
    const backgroundColor = '#181818';
    const color = '#cccccc';
    const borderColor = '#2b2b2b';
    let tabCSSVariableName = '--side-tab-offset';
    let activeTab = sidebarTabs.activeTab;
    
    document.addEventListener('sidebar_tab_changed', () => {
        activeTab = sidebarTabs.activeTab;
    });

    let initialOffset = 0;
    let FileExplorerElement;
    let initialWidth = 0;
    let _calculatedWidth;
    let rem;
    let hideContent = false;
    let vw;
    let PATH_TO_OPTION = 'variables.explorer.x_offset'

    const resizeFromOffset = () => {
        if(!FileExplorerElement) {
            return
        };

        let minWidth = 12*rem;
        let calculatedWidth = initialOffset + initialWidth;
        let leftSnapLimit = 5*rem;
        let hiddenSidebarWidth = 0;
        
        if(calculatedWidth <= (minWidth)) {
            if(calculatedWidth >= leftSnapLimit) {
                calculatedWidth = minWidth;     
                hideContent = false;
            } else {
                calculatedWidth = hiddenSidebarWidth;
                hideContent = true;
            }
        };

        let sidebarWidth = 3 * rem;
        let editorWindowMinimumWidth = 22 * rem
        let maxWidth = (100 * vw) - sidebarWidth - editorWindowMinimumWidth;
         
        if(calculatedWidth >= maxWidth) {
            calculatedWidth = maxWidth;
        }
        
        FileExplorerElement.style.setProperty('width', `${calculatedWidth}px`);
        _calculatedWidth = calculatedWidth;
    }

    const handleResizing = (newDistance) => {
        initialOffset += newDistance;
        resizeFromOffset();
    }
    
    const onDragEnd = () => {
        initialOffset = _calculatedWidth - initialWidth;
        settings.set(PATH_TO_OPTION, `${initialOffset}px`);
    }

    const onDragStart = () => {
        rem = ElementUtils.getRemSize();
        vw = ElementUtils.getVWSize();
    }

    onMount(() => {
        rem = ElementUtils.getRemSize();

        FileExplorerElement = jQuery('.file_explorer')[0];
        initialOffset = parseInt(settings.get(PATH_TO_OPTION));
        FileExplorerElement.style.setProperty('width', `calc(14rem + ${initialOffset}px`);
        initialWidth = 14*rem;
    })
</script>


<div class="file_explorer {hideContent ? 'hide_content' : ''}" style="background: {backgroundColor}; color: {color}; border-color: {borderColor};" id="unselectable" on:selectstart={(e) => e.preventDefault()}>
    <FileExplorerHeader {activeTab}></FileExplorerHeader>
    <FileExplorerBody {activeTab}></FileExplorerBody>
    <ResizeableBorder borders={{
        right: true
    }} {handleResizing} {onDragEnd} {onDragStart}></ResizeableBorder>
</div>


<style>
    .file_explorer {
        height: 100%;
        width: 14rem;
        border-right: solid 1px;
        display: flex;
        flex-direction: column;
        position: relative;
    }
</style>