<script>
  import Debug from "./Debug.svelte";
import Explorer from "./Explorer.svelte";
  import Git from "./Git.svelte";
  import Search from "./Search.svelte";

    export let activeTab;
</script>

{#if activeTab === 'files'}
    <Explorer>

    </Explorer>
{:else if activeTab === 'search'}
    <Search>
        
    </Search>
{:else if activeTab === 'git'}
    <Git>

    </Git>
{:else if activeTab === 'debug'}
    <Debug>

    </Debug>
{/if}


<style>
</style>