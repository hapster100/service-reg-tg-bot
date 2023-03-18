<script lang="ts">
  import { goTo } from "../stores/routes";
  import { isAdmin } from "../stores/user";
</script>

<div class="main-menu fullw">
  <button on:click={goTo.NewOrder}>Записаться</button>
  <button on:click={goTo.MyOrders}>Мои записи</button>
  <button on:click={goTo.Profile}>Профиль</button>
  {#if $isAdmin}
    <hr class="fullw" />
    <button on:click={goTo.CurrentDay}>Дневное расписание</button>
    <button on:click={goTo.ServicesList}>Список услуг</button>
    <button on:click={goTo.Shedulle}>Расписание</button>
    <button on:click={goTo.MasterInfo}>Профиль мастера</button>
  {/if}
</div>


<style>
  .main-menu {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .main-menu button {
    margin: 4px 8px;
  }

</style>
