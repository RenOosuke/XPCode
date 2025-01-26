<script>
    let iconsPath = themeUtils.iconsPath();
    let maskSize = `-webkit-mask-size: .9rem !important;`;
</script>


<div class="dragbar_center">
    <div class="arrows">
        <div class="left_arrow icon  var-left_arrow-icon" style="{maskSize}">
        </div>

        <div class="right_arrow icon var-right_arrow-icon" style="{maskSize}">
        </div>
    </div>

    <div class="directory_searchbar">
        <div class="centered_search">
            <div class="search_icon icon var-search-icon" style="{maskSize}">
            </div>
            
            <p class="directory_name">{directory}</p>
        </div>
    </div>
    
</div>

<style>
    @media(max-width: 520px) {
        .dragbar_center .arrows {
            display: none;
        }
    }
    .icon {
        width: 1rem;
        height: 1rem;
        margin-top: auto;
        margin-bottom: auto;
    }

    .left_arrow {
        margin-right: 1rem;
    }

    .dragbar_center {
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        flex: 0 0 auto; /* Prevents shrinking or growing */
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
        width: 45vw;
        max-width: 40rem;
        display: flex;
        justify-content: center;
        margin-left: 1rem;
        border-radius: .35rem;
        font-size: .8rem;
    }

    .directory_name {
        margin: 0;
        margin-left: .3rem;
        margin-top: auto;
        margin-bottom: auto;
    }
</style>