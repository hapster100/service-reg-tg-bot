<script lang="ts">
  import Route from "./components/router/Route.svelte";
  import Router from "./components/router/Router.svelte"
  import MainMenu from "./screens/MainMenu.svelte"
  import NewCategory from "./screens/NewCategory.svelte";
  import NewOrder from "./screens/NewOrder.svelte";
  import NewService from "./screens/NewService.svelte";
  import OrderList from "./screens/OrderList.svelte"
  import ServicesList from "./screens/ServicesList.svelte";
  import Shedulle from "./screens/Shedulle.svelte";
  import {Route as RoutePath} from './stores/routes'
</script>

<div class="container">
  <Router>
    <Route component={MainMenu} path={RoutePath.MainMenu} />
    <Route component={OrderList} path={RoutePath.MyOrders} />
    <Route component={ServicesList} path={RoutePath.ServicesList} />
    <Route component={NewOrder} path={RoutePath.NewOrder} />
    <Route component={NewService} path={RoutePath.NewService} />
    <Route component={NewCategory} path={RoutePath.NewCategory} />
    <Route component={Shedulle} path={RoutePath.Shedulle} />
  </Router>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    margin: auto;
    padding: 8px;
  }
</style>
