<script lang="ts">
  import { setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { currentPath } from "../../stores/routes";


  const routes: Writable<{path: string}[]> = writable([])
  const activeRoute: Writable<{path: string}|null> = writable(null)

  function registerRoute(route: {path: string}) {
    routes.update(rs => {
      rs.push(route)
      return rs
    })
  }
  
  function unregisterRoute(route: {path: string}) {
    routes.update(rs => {
      const index = rs.indexOf(route);
      rs.splice(index, 1);
      return rs;
    });
  }

  $: {
    for(const route of $routes) {
      if (route.path === $currentPath) {
        $activeRoute = route
        break
      }
    }
  }

  setContext('ROUTER', {
    activeRoute,
    registerRoute,
    unregisterRoute,
  })

</script>

<slot></slot>
