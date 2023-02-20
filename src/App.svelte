<script lang="ts">
  import { getUser, updateUser } from "./api/users";
  import Loader from "./components/Loader.svelte";
  import Route from "./components/router/Route.svelte";
  import Router from "./components/router/Router.svelte"
  import UserForm from "./components/UserForm.svelte";
  import type { User } from "./models/User";
  import MainMenu from "./screens/MainMenu.svelte"
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
      $isAdmin = user.isAdmin
    }
    return user
  }

  let userPromise = getUser(userId).then(updateAdmin)

  function submitHandler({ detail: user }: CustomEvent<User>) {
    userPromise = updateUser(user)
      .then(() => getUser(userId))
      .then(updateAdmin)
  }

</script>

<div class="container">
  {#await userPromise}
    <Loader />
  {:then user}
    {#if user?.phone}
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
        {/if}
      </Router>
      {:else}
      <UserForm on:submit={submitHandler}/>
    {/if}
  {/await}
</div>

<style>
  .container {
    box-sizing: border-box;
    min-height: 100vh;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 700px;
    margin: auto;
    padding: 8px;
  }
</style>
