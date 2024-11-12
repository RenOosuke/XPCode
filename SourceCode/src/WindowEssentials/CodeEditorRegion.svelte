<script>
  import EditorWindow from "../CodeEdtior/EditorWindow.svelte";
  import IntegratedTerminal from "../Terminal/IntegratedTerminal.svelte";

</script>


<div class="code_editor_region">
    <EditorWindow></EditorWindow>
    <IntegratedTerminal></IntegratedTerminal>
</div>


<style>
    .code_editor_region {
        display: flex;
        /* width: 100%; */
        flex-grow: 1;
        min-width: 16rem;
        flex-direction: column;
    }
    
</style>