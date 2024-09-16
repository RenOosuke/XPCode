<script>
    import { onMount } from "svelte";
  import DragBar from "./WindowEssentials/DragBar.svelte";
  import WindowBody from "./WindowEssentials/WindowBody.svelte";
  import InfoFooter from "./WindowEssentials/InfoFooter.svelte";

	export let name;
	const nw = window.nw;
	
	const { require } = window.nw;
	
	window.XPCodeDir = nw.__dirname;
	let _images = path.join(XPCodeDir, 'images');
	let _icons = path.join(_images, 'icons');

	window.paths = {
		images: _images,
		icons: _icons,
	}
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

<main>
	<div class="window">
		<DragBar></DragBar>
		<WindowBody></WindowBody>
		<InfoFooter></InfoFooter>
	</div>
</main>

<style>
	.window {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	main {
		margin: 0;
		height: 100%;
	}

	h1 {
		color: #09ff00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	:global(.nondraggable) {
          -webkit-app-region: no-drag;
    }

	:global(body) {
		padding: 0 !important;
	}
</style>