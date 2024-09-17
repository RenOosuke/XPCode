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
  
      let handleMenuOptionClick = (/** @type {MouseEvent}*/ev, option) => {
          ev.stopPropagation();
  
          if(option.click) {
              option.click();
              hide();
          }
      }
  
      let paddingLeftOffset = `calc(.5rem + 15rem)`;
  
      onMount(() => {
          let shadow = jQuery('.shadow')[0];
          shadow.addEventListener('contextmenu', (ev) => {
              ev.preventDefault();
              hide();
  
              let otherClickedEl = document.elementFromPoint(ev.clientX, ev.clientY);
              const newEvent = new MouseEvent('contextmenu', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  clientX: ev.clientX,
                  clientY: ev.clientY,
                  button: 2
              });
  
              if(otherClickedEl) {
                  otherClickedEl.dispatchEvent(newEvent);
              }
          })
  
          if(shouldBlur) {
              let menuBody = jQuery('.menu_body')[0];
              menuBody.addEventListener('mouseleave', hide);
          }
      })
  </script>
  
  
  <div class="shadow" style="z-index: {zIndex || 100};" on:click={hide}>
      <div class="menu_body" style="{isLeftSide ? `right: ${paddingLeftOffset};`: ''} {x ? `left: ${x}px;` : ''} {y ? `top: ${y}px;` : ''} {hideTopBorder ? 'border-top: none;' : ''}">
          {#each options as option}
              {#if option.separator}
                  <div class="separator_line"></div>
              {:else}
                  <button class="single_menu_option" on:click={(ev) => handleMenuOptionClick(ev, option)}>
                      {#if option.options && isLeftSide}
                          <div class="arrow-placeholder">
                              <div class="arrow-left">
      
                              </div>
                          </div>
                      {/if}
  
                      {option.label}
  
                      {#if option.options && !isLeftSide}
                      <div class="arrow-placeholder">
                          <div class="arrow-right">
  
                          </div>
                      </div>
                      {/if}
                      
                      {#if option.options} 
                          <div class="submenu_options {isLeftSide ? 'left': ''}">
                              {#each (option.options || []) as submenu}
                                  <button class="single_menu_option" on:click={(ev) => handleMenuOptionClick(ev, submenu)}>
                                      {submenu.label}
                                  </button>
                              {/each}
                          </div>
                      {/if}
                  </button>
              {/if}
          {/each}
      </div>
  </div>
  
  
  <style>
      .shadow {
          width: 100%;
          height: 100%;
          position: absolute;
      }
      
      .menu_body {
          background-color: white;
          display: flex;
          flex-direction: column;
          width: fit-content;
          /* box-shadow: rgba(71, 71, 71, 0.3) 2px 2px, rgba(80, 80, 80, 0.2) 4px 4px, rgba(97, 97, 97, 0.1) 6px 6px, rgba(160, 160, 160, 0.05) 8px 8px; */
          box-shadow: rgb(0 0 0 / 49%) 4px 4px 5px 0px;
          border: solid 1px gray;
          padding: .25rem;
          position: relative;
  
      }
  
      .single_menu_option {
          margin: 0;
          width: 15rem;
          text-align: -webkit-left;
          padding: 0.3rem 0.7rem 0.3rem 2rem;
          line-height: 1rem;
          border: none;
          position: relative;
          display: flex;
      }
  
      .single_menu_option:hover{
          background-color: #316ac5;
      }
  
      .single_menu_option.disabled {
          color: gray;
      }
  
      .single_menu_option:not(.disabled):hover {
          color: white;
      }
  
      .single_menu_option:not(.disabled):hover .submenu_options{
          display: initial;
      }
  
      .single_menu_option:not(.disabled):hover .arrow-right{
          border-left-color: white;
      }
  
      .single_menu_option:not(.disabled):hover .arrow-left {
          border-right-color: white;
      }
  
      .separator_line {
          width: 100%;
          height: 1px;
          background: #8080804f;
          margin: .35rem 0rem .5rem 0;
      }
  
      .submenu_options {
          position: absolute;
          left: calc(100% - 0.8rem);
          border: solid 1px gainsboro;
          display: flex;
          flex-direction: column;
          top: 0;
          padding: .17rem;
          background: white;
          display: none;
          box-shadow: rgb(0 0 0 / 49%) 4px 4px 5px 0px;
          z-index: 60;
      }
  
      .submenu_options.left {
          left: calc(-100% - 0.35rem);
      }
      
      .arrow-left {
          border-right: .4rem solid black;
      }
  
      .arrow-left, .arrow-right {
          width: 0; 
          height: 0; 
          border-top: .4rem solid transparent;
          border-bottom: .4rem solid transparent;
      }
  
      .arrow-right {
          border-left: .4rem solid black;
      }
      .arrow-placeholder {
          position: absolute;
          display: ruby;
      }
  
      .arrow-placeholder:has(.arrow-right) {
          right: 0;
          margin-right: 1.3rem;
      }
  
      .arrow-placeholder:has(.arrow-left) {
          left: 0;
          margin-left: .6rem;
      }
  </style>