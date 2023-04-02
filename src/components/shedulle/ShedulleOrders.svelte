<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { getUsers } from "../../api/users";
  import type { Order } from "../../models/Order";
  import type { Service } from "../../models/Service";
  import type { User } from "../../models/User";
  import { goToWithState } from "../../stores/routes";
  import Loader from "../Loader.svelte";
  import OrderInfo from "../OrderInfo.svelte";
  import UserInfo from "../UserInfo.svelte";


  export let orders: Order[]
  export let services: Service[]

  $: usersByIdPromise = getUsers([
    ...new Set(orders.map(order => order.userId))
  ]).then(users => users.reduce(
    (acc, user) => (acc[user.id] = user, acc),
    {} as { [key: string]: User }
  ))

  const dispatch = createEventDispatcher<{
    'delete': Order
  }>()

</script>

{#await usersByIdPromise}
  <Loader />
{:then usersById}
  {#each orders as order (order.id)}
    {@const user = usersById[order.userId] || null}
    <div class="order fullw">
      <OrderInfo {order} {services} />
      <hr>
      <UserInfo {user} />
      <div class="fullw controls">
        <button class="outline-btn controls-btn" on:click={() => dispatch('delete', order)}>Отменить</button>
        <button class="outline-btn controls-btn" on:click={goToWithState.NewOrder({order})}>Изменить</button>
      </div>
    </div>
  {/each}
{/await}

<style>
  .controls {
    display: flex;
    flex-direction: row;
  }

  .controls-btn {
    flex: 1;
    border-radius: 0;
    border-bottom: 0;
    border-left: 0;
  }

  .controls-btn:last-child {
    border-right: 0;
  }

  .order {
    border-radius: 8px;
    border: 1px solid var(--color-text);
    margin-bottom: 12px;
    overflow: hidden;
  }
</style>