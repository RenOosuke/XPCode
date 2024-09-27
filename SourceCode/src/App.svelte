<script>
    import { onMount } from "svelte";
  import DragBar from "./WindowEssentials/DragBar.svelte";
  import WindowBody from "./WindowEssentials/WindowBody.svelte";
  import InfoFooter from "./WindowEssentials/InfoFooter.svelte";
	import Menu from "./WindowEssentials/Menu.svelte";

	// export let name;
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
		window.menu = (menuProps) => {
			let modalContainer = document.getElementsByClassName("menu_placeholder")[0];

			const modal = new Menu({
				target: modalContainer,
				props: spreader(
					menuProps,
					{
						hide: () => {
							modal.$destroy();
						},
					}
				)
			});
		};
		
		themeUtils.changeTheme();
		// menu({zIndex: 10, options: 
		// 	[
		// 		{label: 'Da', click: () => console.log('YES')},
		// 		{separator: true},
		// 		{label: 'Da', click: () => console.log('YES')},
		// 		{label: 'Da', click: () => console.log('YES')},
		// 		{label: 'Da', click: () => console.log('YES')},
		// 		{separator: true},
		// 		{label: 'Da', click: () => console.log('YES')},
		// 		{label: 'Da', click: () => console.log('YES')},
		// 		{label: 'Da', click: () => console.log('YES')},
		// 		{separator: true},
		// 		{label: 'Da', click: () => console.log('YES')},

		// 	], y: 30, x: 30})
	})
</script>

<main>
	<div class="menu_placeholder">

	</div>
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
		font-family: "Segoe WPC", "Segoe UI", sans-serif !important;
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

	:global(#drag-enable) {
		-webkit-app-region: drag;
	}

	:global(body) {
		padding: 0 !important;
	}

	@font-face {
		font-family: Segoe WP;
		src: url(../../fonts/Segoe_WP.ttf)
	}
	
	@font-face {
		font-family: Segoe UI;
		src: url(../../fonts/Segoe_UI.ttf)
	}

	@font-face {
		font-family: Seti_Icon;
		src: url(../../fonts/Seti.woff);
	}

	/* :global(.codicon[class*=codicon-]) {
		display: inline-block;
		font: normal normal normal 16px / 1 codicon;
		text-align: center;
		text-decoration: none;
		text-rendering: auto;
		text-transform: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		user-select: none;
		-webkit-user-select: none;
	} */

	:global(#unselectable) {
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
	}
</style>