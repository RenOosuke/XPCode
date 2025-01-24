<script>
    import { onMount } from "svelte";
  
      export let zIndex;
      export let options = [];
      export let hide;
      export let additionalStyle = {};
      export let isLeftSide = false;
      export let x;
      export let y;
      export let shouldBlur = false;
      export let hideTopBorder = false;
      export let level = 0;
        export let parentWidth = 0;

      const menuId = ElementUtils.generateId();
      const menuElementSelector = `.${menuId}`;
      let menuWidth = 0;

      let handleMenuOptionClick = (/** @type {MouseEvent}*/ev, option) => {
          ev.stopPropagation();
  
          if(option.click) {
              option.click();
              hide();
          }
      }

      const calculateStyle = () => {
        let styleToReturn = `position: absolute; top: 0; left: calc(100% - ${x});`;
        
        if(level == 0) {
            styleToReturn = '';
            if(x) {
                styleToReturn += ` left: ${x}px;`;
            }

            if(y) {
                styleToReturn += ` top: ${y}px;`
            }
        }

        return styleToReturn;
      }
  
      let paddingLeftOffset = `calc(.5rem + 15rem)`;
      
      TODO(`Rework the context menu so that instead of showing submenus as a part of the component, 
      when hovering over an item that has subitems - call menu again, and have the "left/right" 
      calculation in the component in runtime, based on call coordinates.`);
      
      let arrowPositionsHaveLoaded = false;

      let newArrowPositionsByName = {

      };

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
          
          const menuElementProperties = ElementUtils.getBoundingSize(menuElementSelector, {
            width: true,
            height: true,
            top: true,
            left: true
          }, false); // ALL IS IN REM

          let rightEnd = menuElementProperties.width + menuElementProperties.left;
          let bottomEnd = menuElementProperties.height + menuElementProperties.top;
          menuWidth = menuElementProperties.width;

          let windowSizes = document.body.getBoundingClientRect();
          let screenHeight = windowSizes.height // ElementUtils.getSizeInRems(screen.height);
          let screenWidth = windowSizes.width // ElementUtils.getSizeInRems(screen.width);
        
          setTimeout(() => {
              let menuArrows = jQuery(`${menuElementSelector} > .single_menu_option > .arrow-placeholder`);
              menuArrows.toArray().forEach(menuArrow => {
                let arrowParameters = menuArrow.getBoundingClientRect();
                let optionName = menuArrow.getAttribute('_name');

                newArrowPositionsByName[optionName] = arrowParameters;
              })

              arrowPositionsHaveLoaded = true;
          })

          if(screenHeight < bottomEnd) {
            y = y - menuElementProperties.height;
          };

          if(screenWidth < rightEnd) {
            if(level > 0 ){
                x = `100% - ${menuElementProperties.width + 100}px`;
            } else {
                x = x - menuElementProperties.width;
            }
          };
      })
  </script>

    <div class="menu_body var-secondary-border-color {menuId}" style="{level > 0 ? `position: absolute; top: 0; left: calc(100% - ${x}); z-index: ${zIndex};` : ((x ? `left: ${x}px;` : '') + (y ? `top: ${y}px;` : ''))} {hideTopBorder ? 'border-top: none;' : ''}">
        {#each options as option}
            {#if option.separator}
                <div class="separator_line"></div>
            {:else}
                <button class="single_menu_option" on:click={(ev) => handleMenuOptionClick(ev, option)}>
                    {#if option.options && option.options.length > 0 && isLeftSide}
                        <div class="arrow-placeholder _is_left" _name={option.name}>
                            <div class="arrow-left">

                            </div>
                        </div>
                    {/if}

                    {option.label} {!option.options && !option.click ? '(TO DO)' : ''}

                    {#if option.options && option.options.length > 0 && !isLeftSide}
                        <div class="arrow-placeholder _is_right" _name={option.name}>
                            <div class="arrow-right">

                            </div>
                        </div>
                    {/if}
                    
                    {#if option.options && option.options.length > 0 && arrowPositionsHaveLoaded}
                        <div class="submenu_placeholder_relative">
                            <svelte:self
                                    x={"0px"}
                                    y={newArrowPositionsByName[option.name].top || 0}
                                    options={option.options}
                                    zIndex={zIndex + 1}
                                    hide={hide}
                                    level={level+1}
                            />
                        </div>
                    <!-- <Menu x={newArrowPositionsByName[option.name].left} y={newArrowPositionsByName[option.name].top} options={option.options} zIndex={zIndex+1} {hide}></Menu> -->
                        <!-- <div class="submenu_options {isLeftSide ? 'left': ''}">
                            {#each (option.options || []) as submenu}
                                <button class="single_menu_option" on:click={(ev) => handleMenuOptionClick(ev, submenu)}>
                                    {submenu.label} {!submenu.options && !submenu.click ? '(TO DO)' : ''}
                                </button>
                            {/each}
                        </div> -->
                    {/if}
                </button>
            {/if}
        {/each}
    </div>

  <style>
      .shadow {
          width: 100%;
          height: 100%;
          position: absolute;
      }
      
      .menu_body {
          background-color: white;
          display: table;
          flex-direction: column;
          width: fit-content;
          /* box-shadow: rgba(71, 71, 71, 0.3) 2px 2px, rgba(80, 80, 80, 0.2) 4px 4px, rgba(97, 97, 97, 0.1) 6px 6px, rgba(160, 160, 160, 0.05) 8px 8px; */
          box-shadow: rgb(0 0 0 / 49%) 4px 4px 5px 0px;
          /* border: solid 1px gray; */
          padding: .25rem;
          position: relative;
          border: solid .5px;
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
        
          white-space: nowrap; /* Prevents text from wrapping */
            text-overflow: ellipsis; /* Adds '...' if text overflows */
          /* color: var(--context_menu_item_color) */
      }
  
      .single_menu_option:hover{
        /* background-color: var(--hovered_item_bg); */
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
  
      .single_menu_option:not(.disabled):hover > div > .arrow-right{
          border-left-color: white;
      }
  
      .single_menu_option:not(.disabled):hover > div > .arrow-left {
          border-right-color: white;
      }
  
      .separator_line {
            width: calc(100% + .25rem);
            height: 1px;
            margin-top: 0.2rem;
            margin-bottom: 0.4rem;
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
          right: 1rem;
        transform: translate(0, -50%);
        top: 50%;
      }
  
      .arrow-placeholder ._is_right {
          right: 1rem;
          margin-right: 1.3rem;
      }
  
      .arrow-placeholder ._is_left {
          left: 0;
          margin-left: .6rem;
      }

      .single_menu_option:hover > .submenu_placeholder_absolute, .single_menu_option:hover > .submenu_placeholder_relative{
        /* display: unset; */
        opacity: 100;

    }
    
    .submenu_placeholder_absolute {
        /* display: none; */
        opacity: 0;
        position: absolute;
        height: 1rem;
        transform: translate(0, -50%);
        top: 50%;
        left: -.3rem;
      }

      .submenu_placeholder_relative {
        opacity: 0;
        /* display: none; */
        position: relative;
        width: 100%;
        height: 100%;
      }
  </style>