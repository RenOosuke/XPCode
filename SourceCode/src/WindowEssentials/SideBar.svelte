<script>
  import { onMount } from "svelte";

    // TEMP_HARDCODE
    const backgroundColor = '#181818';
    const color = '#cccccc';
    const borderColor = '#2b2b2b';
    const GENERAL_SHORTCUTS = 'shortcuts.general';
    const COMMAND_PALETTE_PATH = `${GENERAL_SHORTCUTS}.command_palette`;

    // TEMP_HARDCODE
    const isDark = true;

    const icons = [
        'files',
        'search',
        'git',
        'debug'
    ];

    const bottom_icons = [
        'settings',
    ]

    let configs = {
        files: {

        },

        search: {

        },

        git: {

        },

        debug: {

        },

        settings: {

        }
    }

    const settingsButtonContextMenu = () => {
        /**
         * @type {singleMenuItem[]}
         */
        let config = 
        [
            {
                label: `Command Palette...`,
                name: 'command_palette',
                shortcut: shortcuts.combinationFromSettings(COMMAND_PALETTE_PATH)
            },
            {
                separator: true
            },
            ...settings.contextMenu.preferences()
        ];

        return config;
    } 

    const settingsContextMenu = (ev) => {
        // Get bottom right corner of the pressed settings cog to call the context menu
        let targetRecs = jQuery('.lower_icons .icon_placeholder .bottom_icon')[0].getBoundingClientRect();
        let x = targetRecs.right;
        let y = targetRecs.bottom;

        let options = settingsButtonContextMenu();

        menu({
            options,
            x,
            y   
        });
    }

    let iconsPath = themeUtils.iconsPath();
    let urlPath = iconsPath;
    
    // TEMP_HARDCODE
    let activeIcon = 0;
    
    const retriggerTabUpdate = () => {
        const customEv = new Event('sidebar_tab_changed');
        document.dispatchEvent(customEv);
    }
    
    const updateSideBarTab = (i) => {
        activeIcon = i;
        
        sidebarTabs.activeTab = icons[activeIcon];
        retriggerTabUpdate();
    }
    
    onMount(() => {
        sidebarTabs.activeTab = icons[activeIcon];
        retriggerTabUpdate();
    })
</script>


<div class="sidebar" style="background: {backgroundColor}; color: {color}; border-color: {borderColor};" id="unselectable" on:selectstart={(e) => e.preventDefault()}>
    <div class="upper_icons">
        {#each icons as icon, i}
            <div class="icon_placeholder{i === activeIcon ? ' pressed' : ''}" on:click={() => updateSideBarTab(i)} >
                <div class="pressed_line">
    
                </div>
    
                <div style="-webkit-mask: var(--{icon}-icon);" class="upper_icon"></div>
            </div>
        {/each}
    </div>

    <div class="lower_icons">
        {#each bottom_icons as icon, i}
            <div class="icon_placeholder" on:click={(ev) => settingsContextMenu(ev)}>    
                <div style="-webkit-mask: var(--{icon}-icon);  -webkit-mask-size: 1.5rem;" class="bottom_icon">

                </div>
            </div>
        {/each}
    </div>
</div>


<style>
    .sidebar {
        height: 100%;
        width: 3rem;
        border-right: solid 1px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 2.5rem;
    }

    .upper_icons {
        display: flex;
        flex-direction: column;
    }

    .icon_placeholder {
        justify-content: center;
        display: flex;
        margin-bottom: .3rem;
        position: relative;
        padding: .5rem 0rem;
    }

    .icon_placeholder.pressed .pressed_line{
        display: initial;
    }
    
    .icon_placeholder:not(.pressed-line):hover {
        cursor: pointer;
    }

    .pressed_line {
        display: none;
        height: 100%;
        min-width: 2px !important;
        width: 2px !important;
        left: 0;
        background-color: #0078d4;
        position: absolute;
        height: 100%;
        top: -50%;
        transform: translate(0, 50%);
    }

    .icon_placeholder .upper_icon, .icon_placeholder .bottom_icon {
        -webkit-mask-size: contain;
    }

    .icon_placeholder.pressed .upper_icon, .icon_placeholder:hover .upper_icon, .icon_placeholder:hover .bottom_icon{
        background-color: var(--sidebar-active-icon);
    }

    .icon_placeholder.remote_button {
        height: 1.5rem;
        padding: 0 !important;
        margin: 0;
        background-color: #0078d4;

    }

    .upper_icon, .bottom_icon{
        background-color: var(--sidebar-inactive-icon);
    }

    .upper_icon, .bottom_icon{
        width: 100%;
        height: 2rem;
    }

    .lower_icons .icon_placeholder {
        margin-bottom: 0;
        margin-top: .2rem;
    }
</style>