<script>
	export let name;
	const nw = window.nw;
	
	const { require } = window.nw;
</script>

<main>
	<h1>Sveltejs & NWJS & Rollup!</h1>
	<ul>
	{#each Object.keys(nw) as nw_module}
		<li>{nw_module} 
			<ul>
				{#each Object.keys(nw[nw_module]) as module_key}
					<li> { module_key } </li>
				{/each}
			</ul>
		</li>
	{/each}
	</ul>
</main>

<style>
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #09ff00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>