<script>
    import { onMount } from "svelte";
    import ResizeableBorder from "../../WindowEssentials/ResizeableBorder.svelte";

    let isExpanded = false;
    export let tabName;
    export let tabButtons;
    export let tabContent

    let isDisabled = false;
    let tabOutlined = false;
    let tabWindowOutlined = false;
    let disableExpansion = false;
    // let isDraggingTab = false;

    let initialOffset = 0;

    const handleTabClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if(!disableExpansion) {
            isExpanded = !isExpanded;
            tabOutlined = true;
            

            // file_explorer.tabSizing.open[indexOfTab].open = isExpanded;

            // let numberOfOpenTabs = file_explorer.tabSizing.open.filter(a => a.open);

            // if (numberOfOpenTabs) {

            // };
            
            // jQuery('file_explorer')[0].classList.
            setTimeout(() => {
                file_explorer.tabSizing.update();
            }, 450) // since it takes 450 millis for the animation to finish, wait the duration, then update the tabsizes
        }

        const listenForBlur = (clickedEv) => {
            let target = clickedEv.target;

            let classPath = elementUtils.getClassList(target).join(' '); 

            if(!classPath.includes('explorer-tab-header ') || !classPath.includes(`${tabName} `)) {
                tabOutlined = false;
            }
        }

        document.addEventListener('mousedown', listenForBlur);
    }

    const outlineTab = () => {
        const selectAllPerKeyboard = (ev) => {
            if(ev.key == "a" && ev.ctrlKey) {
                ev.preventDefault()
                ev.stopPropagation();

                let elements = shortcuts.getVisibleElements();
                let paths = elements.map(_path => _path.getAttribute('full_path'));
                file_explorer.hoveredItem = undefined;
                file_explorer.selectedItems = paths;
                shortcuts.rerenderSelected();
            }
        }
        
        if(isExpanded) {
            tabWindowOutlined = true;

            file_explorer.grayedOut = false;
            themeUtils.setGrayedOut();

            if(file_explorer.selectedItems.length>0) {
                file_explorer.hoveredItem = undefined;
                file_explorer.selectedItems = [];
                shortcuts.rerenderSelected();
            } else {
                document.addEventListener('keydown', selectAllPerKeyboard)
            }

        }

        const listenForBlur = (clickedEv) => {
            let target = clickedEv.target;

            let classPath = elementUtils.getClassList(target).join(' '); 
            let isTargetAFile = classPath.includes('single-folder-item');
            let isTargetATimelineFile = classPath.includes('single_outline_item');
            let isNotExplorerTab = !classPath.includes('explorer-tab '); 
            let isExploirerTabHeader = classPath.includes('explorer-tab-header ');
            let isSameTab = classPath.includes(`tabname-${translatedTabName}`)
            
            if(isNotExplorerTab || isExploirerTabHeader || isTargetAFile || isTargetATimelineFile || !isSameTab) {
                tabWindowOutlined = false;
                document.removeEventListener('keydown', selectAllPerKeyboard);

                if((translatedTabName == routeTranslation.folder && !isSameTab) || (!isTargetAFile)) {
                    file_explorer.grayedOut = true;
                    themeUtils.setGrayedOut();
                } else {
                    file_explorer.grayedOut = false;
                    themeUtils.setGrayedOut();
                }

                if( (translatedTabName == routeTranslation.outline && !isSameTab) || (!isTargetATimelineFile)) {
                    outline.grayedOut = true;
                    themeUtils.setGrayedOut();
                } else {
                    outline.grayedOut = false;
                    themeUtils.setGrayedOut();
                }
            }
        }

        document.addEventListener('mousedown', listenForBlur);
    }

    
    let translationObject = {
        open_editors: 'active',
        folders: 'folder',
        outline: 'outline',
        timeline: 'timeline',
        npm_scripts: 'npm scripts'
    }
    
    let routeTranslation = {
        'active' : "open_editors",
        'folder' : "folders",
        'outline' : "outline",
        'timeline' : "timeline",
        'npm scripts' : "npm_scripts",
    }
    
    let translatedTabName = routeTranslation[tabName];

    const handleResizing = (newDistance) => {
        console.log(newDistance);

        file_explorer.tabSizing.resize({
            name: translatedTabName,
            distance: newDistance
        })
    }

    const onDragStart = () => {
        let indexOfTab = file_explorer.tabSizing.tabIndexes[translatedTabName];

        if(file_explorer.tabSizing.open.length == 0 || file_explorer.tabSizing.open[indexOfTab].open != isExpanded) {
            file_explorer.tabSizing.update();
        }

        disableExpansion = true
    }
    
    const onDragEnd = () => {
        file_explorer.tabSizing.update();

        setTimeout(() => {
            disableExpansion = false
        }, 1)
    }

    onMount(() => {


        let tabroute = `explorer_tabs.show.files.${routeTranslation[tabName]}`;
 
        isDisabled = !settings.section.get(tabroute);

        document.addEventListener('tabsConfigChanged', (ev) => {

            let eventTab = ev.detail.tabName;
            let translatedEventTabName = translationObject[eventTab];

            if(tabName == translatedEventTabName) {
                // console.log(ev.detail)
                isDisabled = !isDisabled
            }
        })
    })
</script>

<div class="explorer-tab tabname-{translatedTabName} {isExpanded ? 'expanded' : ''} {tabWindowOutlined ? 'window-outlined' : ''} {isDisabled ? 'tabDisabled' : ''}" on:click={outlineTab}>
    <div class="explorer-tab-header {tabName} {tabOutlined ? 'outlined' : ''}" on:click={handleTabClick}>
        <ResizeableBorder borders={{
            // top: true,
            top: true
        }} {handleResizing} {onDragStart} {onDragEnd}></ResizeableBorder>

        <div class="left-side">
            <div class="arrow-placeholder">
                <div style="-webkit-mask-size: 1rem;" class="arrow-icon">
                </div>
            </div>
    
            <div class="explorer-tab-name">
                {tabName === 'folder' ? directory : tabName}
            </div>
        </div>

        <div class="right-side">
            {#each tabButtons as singleTabButton}
                <div class="single-tab-button-placeholder {singleTabButton.icon}-icon" data-title-top="{singleTabButton.title}">
                    <diV class="single-tab-button" style="-webkit-mask: var(--{singleTabButton.icon}-icon);-webkit-mask-size: 1rem;">

                    </diV>
                </div>
            {/each}
           <!---ADD THE BUTTONS HERE AFTERWARDS--> 
        </div>
    </div>

    <svelte:component this={tabContent} {isExpanded}/>
</div>


<style>
    .explorer-tab-name {
        min-height: 1rem;
    }

    .arrow-icon {
        background-color: var(--sidebar-inactive-icon);
        height: 1rem;
        width: 1rem;
        margin-right: .2rem;
    }

    .explorer-tab-header {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding-bottom: .35rem;
        padding-top: .25rem;

        /* border-color: #2b2b2b; */
        min-height: .8rem;
        height: .8rem;
        position: relative;
    }

    .explorer-tab {
        border: solid 1px;
        border-top-color: transparent !important;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: #2b2b2b;

        transition: max-height 0.45s ease; /* Smooth animation for max-height */
    }

    .explorer-tab:not(.expanded) {
        max-height: 1.45rem;
    }

    /* .explorer-tab.tabname-folders {
        max-height: min(95vh, var(--folders-y-offset));
    }

    .explorer-tab.tabname-outline {
        max-height: min(95vh, var(--outline-y-offset));
    }

    .explorer-tab.tabname-timeline {
        max-height: min(95vh, var(--timeline-y-offset));
    }

    .explorer-tab.tabname-npm_scripts {
        max-height: min(95vh, var(--npm_scripts-y-offset));
    } */

    .explorer-tab.expanded {
        /* max-height: 95vh; */
        min-height: 5rem;
    }

    :global(.explorer-tab.window-outlined>:not(.explorer-tab-header)) {
        outline: var(--outline-color) 1px solid;

        /* outline-color: var(--outline-color);
        outline-width: 1px;
        outline-offset: -1px; */
    }

    :global(.tab-body) {
        margin-top: .1rem;
        padding-top: .1rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .explorer-tab-header.outlined {
        outline: var(--outline-color) 1px solid;
    }

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
    }

    .left-side {
        display: flex;
        text-transform: uppercase;
        font-size: .7rem;
        font-weight: 700;
    }

    .right-side {
        display: none;
    }

    .expanded:hover .right-side, .expanded.window-outlined .right-side, .expanded .explorer-tab-header.outlined .right-side {
        display: flex;
    }

    .expanded {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-width: 1px;
        border-color: var(--base-border-color);
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
    }

    .single-tab-button {
        background-color: var(--base-text-color);
        height: 100%;
        width: 100%;
    }
    
    .single-tab-button-placeholder {
        height: 1rem;
        width: 1rem;
        margin-right: .35rem;
        padding: .1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: .65rem;
    }

    .single-tab-button-placeholder:hover {
        background-color: var(--icon-hover-bg);
        border-radius: .2rem;
    }

    .more-icon {
        padding: .2rem;
    }

    .single-tab-button-placeholder::after {
        width: max-content;
        top: -200%;
        height: fit-content;
        content: attr(data-title-top);
        /* left: 0; */
        padding: .6rem !important;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 7px 29px 0px;
    }

    .tabDisabled {
        display: none;
    }

    /* .tabname-open_editors.expanded {
        height: var(--open_editors-y-offset);
    } */
     
    .tabname-folders.expanded {
        min-height: var(--folders-y-offset);
    }

    .tabname-outline.expanded {
        min-height: var(--outline-y-offset);
    }
    .tabname-timeline.expanded {
        min-height: var(--timeline-y-offset);
    }
    .tabname-npm_scripts.expanded {
        min-height: var(--npm_scripts-y-offset);
    }

    .tabname-open_editors.expanded {
        min-height: .8rem;
        flex-grow: 0;
    }
</style>