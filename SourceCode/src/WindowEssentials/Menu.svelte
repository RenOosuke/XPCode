<script>
  import { onMount } from "svelte";
  export let zIndex;
  export let options = [];
  export let hide;
  export let additionalStyle = {};
  export let isLeftSide = false;
  export let x;
  export let y;
  export let shouldBlur;
  export let hideTopBorder;

  let handleMenuOptionClick = (/** @type {MouseEvent}*/ ev, option) => {
    console.log(option.name);
    ev.stopPropagation();

    if (option.click) {
      option.click();
      hide();
    }
  };

  let paddingLeftOffset = `calc(.5rem + 15rem)`;

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

    // if (shouldBlur) {
    //   let menuBody = jQuery(".menu_body")[0];
    //   menuBody.addEventListener("mouseleave", hide);
    // }
  });
</script>

<div class="context-menu-shadow">
  <div
    class="context-menu-placeholder dark"
    style="{x ? `left: ${x}px;` : ''} {y ? `top: ${y}px;` : ''}"
    id="context-menu"
  >
    {#each options as option}
      {#if option.separator}
        <div class="splitter"></div>
      {:else}
        <div
          class="menu-item{(option || {}).disabled ? ' disabled' : ''}"
          on:click={(ev) => handleMenuOptionClick(ev, option)}
        >
          {#if option.icon_prefix}
            <div class="explorer-menu-prefix">
              {option.toggled ? "✓" : ""}
            </div>
          {/if}

          {#if option.options && isLeftSide}
            <div class="arrow-placeholder">
              <div
                class="arrow-left"
                style="-webkit-mask: var(--chevron-right-icon);  -webkit-mask-size: 1.5rem;"
              ></div>
            </div>
          {/if}

          {option.label} {!option.options && !option.click ? '(TO DO)' : ''}

          {#if option.options && !isLeftSide}
            <div class="arrow-placeholder right-side">
              <div
                class="arrow-right"
                style="-webkit-mask: var(--chevron-right-icon);  -webkit-mask-size: 1.5rem;"
              ></div>
            </div>
          {/if}

          {#if option.options}
            <div class="context-submenu {isLeftSide ? 'left' : ''}">
              {#each option.options as submenu}
                {#if (submenu || {}).separator}
                  <div class="splitter"></div>
                {:else}
                  <div
                    class="menu-item{(submenu || {}).disabled ? ' disabled' : ''}"
                    on:click={(ev) => handleMenuOptionClick(ev, submenu)}
                  >
                    {(submenu || {}).label}

                    {#if (submenu || {}).options}
                      <div class="arrow-placeholder right-side">
                        <div
                          class="arrow-right"
                          style="-webkit-mask: var(--chevron-right-icon);  -webkit-mask-size: 1.5rem;"
                        ></div>
                      </div>

                      <div class="context-submenu-lvl2">
                        {#each (submenu || {}).options as submenu_lvl2}
                          {#if (submenu_lvl2 || {}).separator}
                            <div class="splitter"></div>
                          {:else}
                            <div
                              class="menu-item{(submenu_lvl2 || {}).disabled ? ' disabled' : ''}"
                              on:click={(ev) =>
                                handleMenuOptionClick(ev, submenu_lvl2)}
                            >
                              {(submenu_lvl2 || {}).label}
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
    background: var(--primary-dark-bg);
    border: solid 1px #2b2b2b;
    color: #adaeae;
  }
  .context-menu-placeholder .menu-item,
  .context-submenu .menu-item,
  .context-submenu-lvl2 .menu-item {
    position: relative;
    cursor: pointer;
    width: 20rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    padding-left: 1.75rem;
    box-sizing: border-box;
    height: 2rem;
    padding-top: 0.5rem;
    border-radius: 0.25rem;
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
  #context-menu.dark .context-menu-placeholder,
  #context-menu.dark .context-submenu {
    /* color: #f0f0f0; */
    background-color: var(--primary-dark-bg);
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
</style>
