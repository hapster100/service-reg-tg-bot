<script lang="ts">
  import { reset } from "../stores/newOrder";
  import { goTo } from "../stores/routes";

</script>

<div class="main-menu fullw">
  <button on:click={() => {reset(); goTo.NewOrder()}}>Записаться</button>
  <button on:click={goTo.MyOrders}>Мои записи</button>
  <hr class="fullw" />
  <button on:click={goTo.ServicesList}>Список услуг</button>
  <button on:click={goTo.Shedulle}>Расписание</button>
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
