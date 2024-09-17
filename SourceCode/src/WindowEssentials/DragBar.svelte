<script>
  import DragBarCenter from "../DragBar/DragBarCenter.svelte";
import DragBarLeft from "../DragBar/DragBarLeft.svelte";
  import DragBarRight from "../DragBar/DragBarRight.svelte";

    // TEMP_HARDCODE
    const backgroundColor = '#181818';
    const color = '#cccccc';
    const borderColor = '#2b2b2b';
</script>


<div class="dragbar" style="background: {backgroundColor}; color: {color}; border-color: {borderColor};">
    <DragBarLeft></DragBarLeft>
    <div class="draggable_area"></div>
    <DragBarCenter></DragBarCenter>
    <div class="draggable_area"></div>
    <DragBarRight></DragBarRight>
</div>


<style>
    .dragbar {
        height: 2.5rem;
        background-color: blue;
        border-bottom: solid 1px;
        display: flex;
        justify-content: space-between;
    }
</style>