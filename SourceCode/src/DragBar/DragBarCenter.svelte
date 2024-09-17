<script>
    let iconsPath = themeUtils.iconsPath();
    let maskSize = `-webkit-mask-size: .9rem !important;`;
</script>


<div class="dragbar_center">
    <div class="arrows">
        <div class="left_arrow icon" style="-webkit-mask: url('{`${iconsPath}/left_arrow.svg`}') no-repeat center; {maskSize}">
        </div>

        <div class="right_arrow icon" style="-webkit-mask: url('{`${iconsPath}/right_arrow.svg`}') no-repeat center; {maskSize}">
        </div>
    </div>

    <div class="directory_searchbar">
        <div class="centered_search">
            <div class="search_icon icon" style="-webkit-mask: url('{`${iconsPath}/search.svg`}') no-repeat center; {maskSize}">
            </div>
            
            <p class="directory_name">{directory}</p>
        </div>
    </div>
    
</div>


<style>
    .icon {
        width: .9rem;
        height: .9rem;
        margin-top: auto;
        margin-bottom: auto;
    }

    .left_arrow {
        margin-right: 1rem;
    }

    .icon:not(.innactive) {
        background-color: var(--sidebar-inactive-icon);
    }

    .dragbar_center {
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
    }

    .arrows {
        display: flex;
    }

    .centered_search {
        display: flex;
    }

    .directory_searchbar {
        background-color: #242424;
        padding: .2rem;
        border: solid 1px #454545;
        width: 35rem;
        display: flex;
        justify-content: center;
        margin-left: 1rem;
        border-radius: .35rem;
        font-size: .8rem;
    }

    .directory_name {
        margin: 0;
        margin-left: .3rem;
    }
</style>