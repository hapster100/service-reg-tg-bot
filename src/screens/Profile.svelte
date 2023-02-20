<script lang="ts">
  import { getUser, updateUser } from "../api/users";
  import BackToMenu from "../components/BackToMenu.svelte";
  import Loader from "../components/Loader.svelte";
  import UserForm from "../components/UserForm.svelte";
  import { goTo } from "../stores/routes";
  import { userId } from "../stores/user";

  const userPromise = getUser(userId)

</script>

<h3 class="page-title">
  Профиль
</h3>
<div class="profile fullw">
  {#await userPromise}
    <Loader />
  {:then user} 
    <UserForm 
      name={user?.name || ''}
      phone={user?.phone?.digits}
      on:submit={({detail}) => {updateUser(detail); goTo.MainMenu();}}
    />
  {/await}
</div>

<BackToMenu />

<style>
  .profile {
    margin-bottom: 12px;
  }
</style>
