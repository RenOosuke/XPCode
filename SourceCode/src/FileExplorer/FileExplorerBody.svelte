<script>
  import Debug from "./Debug.svelte";
import Explorer from "./Explorer.svelte";
  import Git from "./Git.svelte";
  import Search from "./Search.svelte";

    export let activeTab;
</script>

<Explorer {activeTab}>

</Explorer>

<Search {activeTab}>
    
</Search>

<Git {activeTab}>

</Git>
<Debug {activeTab}>

</Debug>

<style>
</style>