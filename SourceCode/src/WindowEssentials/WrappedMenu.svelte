<script>
    import { onMount } from "svelte";
    import Menu from "./Menu.svelte";
  
      export let zIndex;
      export let options = [];
      export let hide;
      export let additionalStyle = {};
      export let isLeftSide = false;
      export let x;
      export let y;
      export let shouldBlur;
      export let hideTopBorder;
      export let level = 0;
  </script>
  
    <div class="shadow" style="z-index: {zIndex || 100};" on:click={hide}>
        <Menu zIndex={zIndex || 100} {options} {hide} {additionalStyle} {isLeftSide} {x} {y} {shouldBlur} {hideTopBorder} {level}></Menu>
    </div>

  <style>
      .shadow {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
      }
  </style>