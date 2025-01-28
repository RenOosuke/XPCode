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

      let rem = ElementUtils.getRemSize();
      const WIDTH_PER_SYMBOL = 0.368 * rem;
      const WIDTH_PER_ARROW = 3 * rem;
      const PADDING_OF_MENU = .25 * rem;
      const PADDING_OF_OPTION_LEFT = 2 * rem;
      const PADDING_OF_OPTION_RIGHT = .7 * rem;
      const PADDING_LEFT = PADDING_OF_OPTION_LEFT;
      const PADDING_RIGHT = PADDING_OF_OPTION_RIGHT;
      const MARGIN_MIDDLE = 5 * rem;
      const BORDER_THICKNESS = 1;
      let menuWidth = 0;
      let right = undefined;
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

      let longestLabel = options.reduce((acc, _option) => {
        let currentLabel = _option.label;
        if(_option.separator) {
            return acc;
        }

        if(acc.length < currentLabel.length) {
            return currentLabel;
        };

        return acc;
      }, '');

      let hasArrows = options.reduce((acc, _option) => {
        return acc || !!_option.options
      }, false);


      const MIN_WIDTH_FROM_LABEL = WIDTH_PER_SYMBOL * longestLabel.length; // this is the estimated width per letter
      let CALCULATED_WIDTH = PADDING_LEFT + MIN_WIDTH_FROM_LABEL + MARGIN_MIDDLE +  (+hasArrows * WIDTH_PER_ARROW) + PADDING_RIGHT;
      const OWN_WIDTH = CALCULATED_WIDTH + ( 2 * PADDING_OF_MENU) + (2*BORDER_THICKNESS);

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

          let isBeyondBottom = screenHeight < bottomEnd;

          if(isBeyondBottom) {
            if(level > 0) {
                // Move the entire menu upwards by its height MINUS 1.6rem 
                // (2 * .3rem padding and 1rem line height)
                y = `calc(-${menuElementProperties.height}px + 1.6rem)`;
            } else {
                y = y - menuElementProperties.height;
            }
          } 
          
          if(!isBeyondBottom && level > 0){
            y = `-.5rem`
          };

          let isBeyondRightBorder = screenWidth < rightEnd

          if(isBeyondRightBorder) {
            if(level > 0 ){
                right = `${parentWidth}px - 1rem`;
                console.log(`SHOULD GO RIGHT`)
            } else {
                x = x - menuElementProperties.width;
            }
          } 
          
          if(!isBeyondRightBorder && level > 0){
            x = `1rem`;
          };
      })
  </script>

    <div class="menu_body var-context-menu-color var-context-menu-bg var-secondary-border-color {menuId}" 
    style="width: {CALCULATED_WIDTH}px; 
    {
        level > 0 
        ? (
            `position: absolute;
            top: ${y};
            z-index: ${zIndex};
            `
            + (right
                ?
                `right: calc(${right});`
                :
                `left: calc(${x});`
              ) 
          ) 
        : (
            (x ? `left: ${x}px;` : '') + 
            (y ? `top: ${y}px;` : '')
        )
    }

    {hideTopBorder ? 'border-top: none;' : ''}">

        {#each options as option}
            {#if option.separator}
                <div class="separator_line var-splitter"></div>
            {:else}
                <button class="single_menu_option" on:click={(ev) => handleMenuOptionClick(ev, option)}>
                    <span class="content">
                        {option.label} {!option.options && !option.click ? '(TO DO)' : ''}
                    </span>
                        
                    {#if option.options && option.options.length > 0}
                        <div class="stretcher">

                        </div>
                        <div class="arrow-placeholder _is_right" _name={option.name}>
                            &#60086;
                        </div>
                    {/if}
                    
                    {#if option.options && option.options.length > 0 && arrowPositionsHaveLoaded}
                        <div class="submenu_placeholder_relative">
                            <!-- <div class="submenu_placeholder_absolute">
                            </div> -->
                            <svelte:self
                                    x={"0px"}
                                    y={newArrowPositionsByName[option.name].top || 0}
                                    options={option.options}
                                    zIndex={zIndex + 1}
                                    hide={hide}
                                    level={level+1}
                                    parentWidth={OWN_WIDTH}
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
          display: table;
          flex-direction: column;
          width: fit-content;
          /* box-shadow: rgba(71, 71, 71, 0.3) 2px 2px, rgba(80, 80, 80, 0.2) 4px 4px, rgba(97, 97, 97, 0.1) 6px 6px, rgba(160, 160, 160, 0.05) 8px 8px; */
          box-shadow: rgb(0 0 0 / 49%) 4px 4px 5px 0px;
          /* border: solid 1px gray; */
          padding: .25rem;
          position: relative;
          border: solid 1px;
            border-radius: 0.25rem;
          font-size: .8125rem;
      }
  
      .single_menu_option {
          margin: 0;
          /* width: 15rem; */
          width: 100%;
          text-align: -webkit-left;
          padding: 0.3rem 0.7rem 0.3rem 2rem;
          line-height: 1rem;
          border: none;
          position: relative;
          display: flex;
          background-color: transparent;
          justify-content: space-between;
          /* Prevents text from wrapping */
          text-overflow: ellipsis;
          white-space: nowrap;
          /* Adds '...' if text overflows */
          /* color: var(--context_menu_item_color) */
          flex: 0 0 auto;
      }

      .stretcher {
        width: -webkit-fill-available;
      }

      .single_menu_option .content {
        /* display: table; */
      }
  
      .single_menu_option:not(.disabled):hover {
        cursor: pointer;    
    }
  
      .single_menu_option.disabled {
          color: gray;
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
            width: calc(100% + .5rem);
            height: 1px;
            margin-top: 0.2rem;
            margin-bottom: 0.4rem;
            left: -.25rem;
            position: relative;
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
          /* position: absolute;
          display: ruby;
          right: 1rem;
        transform: translate(0, -50%);
        top: 50%; */
        padding: 0 .5em;
        font-family: codicon;
      }

      /* .arrow-placeholder::after {
        content: '\eab6';
        font-family: codicon;
      } */
  
      .arrow-placeholder ._is_right {
          right: 1rem;
          margin-right: 1.3rem;
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
        height: 100%;
      }
  </style>