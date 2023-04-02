<script lang="ts">
  import { getUser } from "./api/users";
  import Loader from "./components/Loader.svelte";
  import Route from "./components/router/Route.svelte";
  import Router from "./components/router/Router.svelte"
  import type { User } from "./models/User";
  import ClientsList from "./screens/ClientsList.svelte";
  import CurrentDayShedulle from "./screens/CurrentDayShedulle.svelte";
  import EditCategory from "./screens/EditCategory.svelte";
  import EditService from "./screens/EditService.svelte";
  import MainMenu from "./screens/MainMenu.svelte"
  import MasterInfo from "./screens/MasterInfo.svelte";
  import NewCategory from "./screens/NewCategory.svelte";
  import NewOrder from "./screens/NewOrder.svelte";
  import NewService from "./screens/NewService.svelte";
  import OrderList from "./screens/OrderList.svelte"
  import Profile from "./screens/Profile.svelte";
  import ServicesList from "./screens/ServicesList.svelte";
  import Shedulle from "./screens/Shedulle.svelte";
  import {Route as RoutePath} from './stores/routes';
  import { isAdmin, userId } from "./stores/user";

  const updateAdmin = (user: User|null) => {
    if (user?.isAdmin) {
      $isAdmin = user.isAdmin || import.meta.env.VITE_DEV_MOD === '1'
    }
    return user
  }

  let userPromise = getUser(userId)
    .then(updateAdmin)
</script>

<div class="container">
  {#await userPromise}
    <Loader />
  {:then}
    <Router>
      <Route component={MainMenu} path={RoutePath.MainMenu} />
      <Route component={OrderList} path={RoutePath.MyOrders} />
      <Route component={NewOrder} path={RoutePath.NewOrder} />
      <Route component={Profile} path={RoutePath.Profile} />
      {#if $isAdmin}
        <Route component={ServicesList} path={RoutePath.ServicesList} />
        <Route component={NewService} path={RoutePath.NewService} />
        <Route component={NewCategory} path={RoutePath.NewCategory} />
        <Route component={Shedulle} path={RoutePath.Shedulle} />
        <Route component={EditCategory} path={RoutePath.EditCategory} />
        <Route component={EditService} path={RoutePath.EditService} />
        <Route component={MasterInfo} path={RoutePath.MasterInfo} />
        <Route component={CurrentDayShedulle} path={RoutePath.CurrentDay} />
        <Route component={ClientsList} path={RoutePath.ClientsList} />
      {/if}
    </Router>
  {:catch}
      <div>Ссылка не действительна</div>
  {/await}
</div>

<style>
  .container {
    box-sizing: border-box;
    min-height: 100vh;
    background-color: var(--color-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 700px;
    margin: auto;
    padding: 8px;
  }
</style>
