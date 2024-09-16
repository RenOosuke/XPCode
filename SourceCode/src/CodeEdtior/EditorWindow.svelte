<script>
  import { onMount } from "svelte";
  import EmptyEditor from "./EmptyEditor.svelte";

	let activeEditors = 0;

    // const activeEditors = [{}];

    onMount(() => {
        // var editor = ace.edit("editor");
		// window.vscode = editor;
		// setTheme("twilight");
		// editor.session.setMode("ace/mode/javascript");
		// editor.setOption("enableBasicAutocompletion", true);
		// editor.setOption("enableLiveAutocompletion", true);
		// // editor.setOption("enableEmmet", true);

		// var OptionPanel = ace.require("ace/ext/options").OptionPanel;
		// // var panel = new OptionPanel(editor, document.getElementById("options"));
		// // panel.render();
		// // var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
		// // var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
		// // console.log(statusBar);
		// var modelist = ace.require("ace/ext/modelist");
		// ace.require("./src-noconflict/ext-emmet-core.js");
		// ace.require("ace/ext/emmet").setCore("ext-emmet/core");
    })
</script>


<div class="editor_window {activeEditors === 0 ? 'empty' : ''}" id="editor">
	{#if activeEditors>0}
		<div></div>
	{:else}
		<EmptyEditor></EmptyEditor>
	{/if}
</div>


<style>
    .editor_window {
        height: 100%;
    }

	.editor_window.empty {
		display: flex;
		flex-direction: column;
	}
</style>