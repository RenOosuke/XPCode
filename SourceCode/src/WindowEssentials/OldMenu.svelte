<script>
  import { onMount } from "svelte";
  export let zIndex = 20;
  export let options = [];
  export let hide;
  export let additionalStyle = {};
  export let isLeftSide = false;
  export let x;
  export let y;
  export let shouldBlur;
  export let hideTopBorder = false;

  let handleMenuOptionClick = (/** @type {MouseEvent}*/ ev, option) => {
    ev.stopPropagation();

    if (option.click) {
      option.click();
      hide();
    }
  };

  // let level1ShouldBeLeft = false;
  // let level2ShouldBeLeft = false;

  // let level
  let transformStyle = '';

  let paddingLeftOffset = `calc(.5rem + 15rem)`;
  let transformX = '0%';
  let transformY = '0%';
  let level2TransformY = '0%';
  let level2TransformX = '0%'
  
  onMount(() => {
    let shadow = jQuery(".context-menu-shadow")[0];
    shadow.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
      hide();

      let otherClickedEl = document.elementFromPoint(ev.clientX, ev.clientY);
      const newEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: ev.clientX,
        clientY: ev.clientY,
        button: 2,
      });

      if (otherClickedEl) {
        otherClickedEl.dispatchEvent(newEvent);
      }
    });

    shadow.addEventListener("click", () => {
      hide();
    });

    let screenRects = document.body.getBoundingClientRect();
    let screenHeight = screenRects.height
    let screenWidth = screenRects.width;


    if(x>(screenWidth*0.8)) {
      transformX = `-100%`
    }

    if(y>(screenHeight*0.6)) {
      transformY = `calc(-100% + 2rem)`
    }

    if(y>(screenHeight*0.8)) {
      level2TransformY = `calc(-100% + 2rem)`
    }
    // if (shouldBlur) {
    //   let menuBody = jQuery(".menu_body")[0];
    //   menuBody.addEventListener("mouseleave", hide);
    // }
  });
</script>

<div class="context-menu-shadow" id="unselectable">
  <div
    class="context-menu-placeholder var-base-text-color dark var-primary-dark-bg"
    style="{x ? `left: ${x}px;` : ''} {y ? `top: ${y}px;` : ''}; transform: translate({transformX}, {transformY});"
    id="context-menu"
  >
    {#each options as option}
      {#if option.separator}
        <div class="splitter"></div>
      {:else}
        <div
          class="menu-item{(option || {}).disabled ? ' disabled' : ''} {option.icon_prefix ? 'has-prefix' : ''} {option.icon_prefix ? 'shorter' : ''}"
          on:click={(ev) => handleMenuOptionClick(ev, option)}
        >
          {#if option.icon_prefix}
            <div class="explorer-menu-prefix {option.toggled ? "" : "transparent"}" >
              ✓
            </div>
          {/if}

          {#if option.options && isLeftSide}
            <div class="arrow-placeholder">
              <div
                class="arrow-left var-chevron-right-icon"
                style="-webkit-mask-size: 1.5rem;"
              ></div>
            </div>
          {/if}

          {option.label} {!option.options && !option.click ? '(TO DO)' : ''}

          {#if option.shortcut}
            <span class="shortcut">
              {option.shortcut}
            </span>
          {/if}

          {#if option.options && !isLeftSide}
            <div class="arrow-placeholder right-side">
              <div
                class="arrow-right var-chevron-right-icon"
                style="-webkit-mask-size: 1.5rem;"
              ></div>
            </div>
          {/if}

          {#if option.options}
            <div class="context-submenu var-base-text-color var-primary-dark-bg {isLeftSide ? 'left' : ''}" style="transform: translate({level2TransformX}, {level2TransformY});">
              {#each option.options as submenu}
                {#if submenu.separator}
                  <div class="splitter"></div>
                {:else}
                  <div
                    class="menu-item{submenu.disabled ? ' disabled' : ''}"
                    on:click={(ev) => handleMenuOptionClick(ev, submenu)}
                  >
                    {submenu.label} {!submenu.options && !submenu.click ? '(TO DO)' : ''}

                    {#if submenu.shortcut}
                      <div class="shortcut">
                        {submenu.shortcut}
                      </div>
                    {/if}

                    {#if submenu.options}
                      <div class="arrow-placeholder right-side">
                        <div
                          class="arrow-right var-chevron-right-icon"
                          style="-webkit-mask-size: 1.5rem;"
                        ></div>
                      </div>

                      <div class="context-submenu-lvl2 var-primary-dark-bg var-base-text-color">
                        {#each submenu.options as submenu_lvl2}
                          {#if submenu_lvl2.separator}
                            <div class="splitter"></div>
                          {:else}
                            <div
                              class="menu-item{submenu_lvl2.disabled ? ' disabled' : ''}"
                              on:click={(ev) =>
                                handleMenuOptionClick(ev, submenu_lvl2)}
                            >
                              {submenu_lvl2.label} {!submenu_lvl2.click ? '(TO DO)' : ''}

                              {#if submenu_lvl2.shortcut}
                                <div class="shortcut">
                                  {submenu_lvl2.shortcut}
                                </div>
                              {/if}
                            </div>
                          {/if}
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .context-menu-shadow {
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 50;
  }

  .context-menu-placeholder,
  .context-submenu,
  .context-submenu-lvl2 {
    width: fit-content;
    display: flex;
    flex-direction: column;
    border-radius: 0.4rem;
    position: absolute;
    font-size: 0.8rem;
    border: solid .5px var(--secondary-border-color);
    box-shadow: rgba(0, 0, 0, 0.36) 0px 2px 8px 0px;
    z-index: 10000;
  }
  .context-menu-placeholder .menu-item,
  .context-submenu .menu-item,
  .context-submenu-lvl2 .menu-item {
    position: relative;
    cursor: pointer;
    width: auto;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    padding-left: 1.75rem;
    box-sizing: border-box;
    height: 2rem;
    padding-top: 0.5rem;
    border-radius: 0.25rem;
    display: flex;
    justify-content: space-between;
    min-width: 20rem;
    padding-right: 1rem;
    white-space: nowrap;
  }
  .context-menu-placeholder .menu-item.prefix,
  .context-submenu .menu-item.prefix
  .context-submenu .menu-item.menu-item.prefix {
    display: flex;
  }
  .context-menu-placeholder .menu-item .arrow-placeholder,
  .context-submenu .menu-item .arrow-placeholder {
    position: absolute;
    right: 0.5rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    top: 0;
  }
  .context-menu-placeholder .menu-item .arrow-placeholder .arrow-box,
  .context-submenu .menu-item .arrow-placeholder .arrow-box {
    height: 0.85rem;
    width: 0.85rem;
  }
  .context-menu-placeholder .menu-item .arrow,
  .context-submenu .menu-item .arrow {
    border: solid black;
    border-width: 0 0.15rem 0.15rem 0;
    display: inline-block;
    padding: 0.18rem;
  }
  .context-menu-placeholder .menu-item .right,
  .context-submenu .menu-item .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  .context-menu-placeholder .menu-item:first-child,
  .context-submenu .menu-item:first-child {
    margin-top: 0.3rem;
  }
  .context-menu-placeholder .menu-item:last-child,
  .context-submenu .menu-item:last-child, .context-submenu-lvl2 .menu-item:last-child {
    margin-bottom: 0.25rem;
  }
  .context-menu-placeholder .splitter,
  .context-submenu .splitter,
  .context-submenu-lvl2 .splitter {
    width: 100%;
    height: 1px;
    margin-top: 0.2rem;
    margin-bottom: 0.4rem;
  }
  .context-menu-placeholder p,
  .context-submenu p {
    margin: 0;
  }

  #context-menu .context-submenu, .context-submenu-lvl2 {
    left: 100%;
    top: 0;
    display: none;
  }
  #context-menu .menu-item:hover .context-submenu {
    display: initial;
  }

  .context-submenu .menu-item:hover .context-submenu-lvl2 {
    display: initial;
  }

  #context-menu.dark .splitter {
    background-color: #454545;
  }
  #context-menu.dark .menu-item:not(.disabled):hover {
    background-color: #04395e;
    color: #feffff;
  }
  #context-menu.dark,
  #context-menu.dark .context-submenu,
  #context-menu.dark .context-submenu-lvl2 {
    /* color: #f0f0f0; */
    background-color: var(--primary-light-bg);
  }

  .arrow-placeholder {
    position: absolute;
    height: 100%;
    width: 1rem;
  }

  .arrow-placeholder div {
    height: 0.6rem;
    background-color: var(--primary-light2-bg);
  }

  .arrow-placeholder.right-side {
    height: 0.6rem;
  }

  .menu-item.disabled {
    color: var(--primary-light3-bg);
    cursor: default;
  }

  .explorer-menu-prefix {
        width: fit-content;
        display: inline;
    }

    .explorer-menu-prefix.transparent {
      color: transparent;
    }

  .menu-item.shorter {
    padding-left: .75rem;
  }

  .shortcut {
    width: fit-content;
    margin-right: .5rem;
  }

  .has-prefix {
    display: block !important;
  }
</style>
