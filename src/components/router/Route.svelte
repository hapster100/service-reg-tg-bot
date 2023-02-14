<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import type { Writable } from "svelte/store";


  export let path: string
  export let component: ConstructorOfATypedSvelteComponent
  const {
    registerRoute,
    activeRoute,
    unregisterRoute,
  } = getContext('ROUTER') as {
    registerRoute: (route: {path: string}) => void,
    unregisterRoute: (route: {path: string})=>void,
    activeRoute: Writable<{path: string}>,
  }

  const route = { path }

  registerRoute(route)

  onDestroy(() => {
    unregisterRoute(route)
  })
</script>

{#if route === $activeRoute}
  <svelte:component this={component} />
{/if}
