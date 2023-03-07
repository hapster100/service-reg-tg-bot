<script lang="ts">
  import { getAddress } from "../../api/masters";
  import { getAllServices } from "../../api/services";
  import type { Service } from "../../models/Service";
  import type { OrderStore } from "../../stores/newOrder";
  import Loader from "../Loader.svelte";

  export let store: OrderStore
  const { day, month, serviceIds, time, year }  = store

  const servicesByIdPromise = getAllServices().then(
    services => services.reduce((acc, s) => (acc[s.id] = s, acc), {} as {[key: string]: Service})
  )

  const dateStr = new Date($year, $month, $day).toLocaleDateString('ru', {
    month: 'long',
    day: 'numeric',
  })

  const addressPromise = getAddress()

</script>
{#await Promise.all([servicesByIdPromise, addressPromise])}
  <Loader />
{:then [serviceById, address]}
  <div class="success">
    <h3 class="page-title">
      Запись успешно создана!
    </h3>
    <div class="info">
      Ждем вас в {$time} {dateStr}<br>
      {address}<br>
    </div>
    <div class="list">
      <div class="list-title">Список услуг:</div>
      {#each $serviceIds as id}
          <div class="item">{serviceById[id].name}</div>
      {/each}
    </div>
  </div>
{/await}

<style>
  .success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .list {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 60px;
  }

  .list-title {
    font-weight: bold;
  }

  .info {
    font-size: 1.1rem;
    line-height: 1.5rem;
    margin-top: 40px;
    font-style: italic;
    text-align: center;
  }

  .item {
    margin-top: 8px;
  }

</style>
