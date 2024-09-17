<script>
    const dragbarContextMenus = [
        {
            label: 'File',
            name: 'file',
        },
        {
            label: 'Edit',
            name: 'edit',
        },
        {
            label: 'Selection',
            name: 'selection',
        },
        {
            label: 'View',
            name: 'view',
        },
        {
            label: 'Go',
            name: 'go',
        },
        {
            label: 'Run',
            name: 'run',
        },
        {
            label: 'Terminal',
            name: 'terminal',
        },
        {
            label: 'Help',
            name: 'help',
        },
    ];

    const handleDragBarMenButtonClick = (buttonName) => {
        console.log(buttonName)
    }

    let iconsPath = themeUtils.iconsPath();
    let maskSize = `-webkit-mask-size: 1rem !important;`;
    
    let vscodeIconPath = path.join(paths.icons, 'default', 'vscode.png');
</script>


<div class="dragbar_left">
    <div class="logo_placeholder">
        <img src="{vscodeIconPath}" alt=""/>
    </div>

    {#each dragbarContextMenus as contextMenuButton} 
        <div class="context_menu_button_placeholder" on:click={() => handleDragBarMenButtonClick(contextMenuButton.name)}>
            {contextMenuButton.label}
        </div>
    {/each}

    <div class="context_menu_cake_menu" style="-webkit-mask: url('{`${iconsPath}/cake.svg`}') no-repeat center; {maskSize}">

    </div>
</div>


<style>
    .dragbar_left {
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        margin-left: .7rem;
    }

    .logo_placeholder img{
        height: 1rem;
    }

    .logo_placeholder {
        /* margin-top: auto; */
        /* margin-bottom: auto; */
        margin-right: .5rem;
    }

    .context_menu_button_placeholder {
        margin-left: .1rem;
        color: #c9c9c9;
        font-size: .8rem;
        padding: .1rem .4rem;
    }

    .context_menu_button_placeholder:hover {
        background-color: #313232;
        color: #cccccc;
        cursor: default;
        border-radius: .3rem;
    }

    .context_menu_cake_menu {
        background-color: var(--sidebar-active-icon);
        width: 1rem;
        height: 1rem;
        margin-top: auto;
        margin-bottom: auto;
        margin-left: .5rem;
        display: none;
    }
</style>