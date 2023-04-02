<script lang="ts">
  import { writable } from "svelte/store";
  import { cancelOrder, myOrders, userOrders } from "../api/orders";
  import { getAllServices } from "../api/services";
  import type { Service } from "../models/Service";
  import type { Order } from "../models/Order";
  import Loader from "../components/Loader.svelte";
  import BackToMenu from "../components/BackToMenu.svelte";
  import OrderInfo from "../components/OrderInfo.svelte";
  import { userId } from "../stores/user";

  const ordersPromise = writable(userOrders(history.state?.userId ?? userId))
  const servicesPromise = writable(getAllServices())
  
  let both: Promise<[Order[], Service[]]>

  $: {
    both = Promise.all([$ordersPromise, $servicesPromise])
  }

  async function cancel(id) {
    await cancelOrder(id)
    $ordersPromise = userOrders(history.state?.userId ?? userId)
  }

  function filter(order: Order) {
    if (history.state?.showAll) {
      return true
    }
    const orderDate = new Date(order.date)
    orderDate.setHours(order.time.hours)
    orderDate.setMinutes(order.time.minutes)
    return orderDate > new Date()
  }
</script>

<h3 class="page-title">Мои записи</h3>
{#await both}
  <Loader />
{:then [orders, services]}
  {@const filtered = orders.filter(filter)}
  <div class="fullw">
    {#each filtered as order}
      <div class="order">
        <OrderInfo 
          order={order}
          services={services}
        />
        <button on:click={() => cancel(order.id)}>Отменить</button>
      </div>
    {/each}
  </div>
{/await}
<BackToMenu />

<style>
  .order {
    overflow: hidden;
    border: 1px solid var(--color-text);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--color-text);
    margin-bottom: 20px;
  }

  .order button {
    border-radius: 0;
  }

</style>
