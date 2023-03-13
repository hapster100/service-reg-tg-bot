<script lang="ts">
  import { getUsers } from "../../api/users";
  import type { Order } from "../../models/Order";
  import type { Service } from "../../models/Service";
  import type { User } from "../../models/User";
  import { goToWithState } from "../../stores/routes";
  import Loader from "../Loader.svelte";
  import OrderInfo from "../OrderInfo.svelte";


  export let orders: Order[]
  export let services: Service[]

  const usersByIdPromise : Promise<{ [key: string] : User }> = getUsers([
    ...new Set(orders.map(order => order.userId))
  ]).then(users => users.reduce(
    (acc, user) => (acc[user.id] = user, acc),
    {} as { [key: string]: User }
  ))

</script>

{#await usersByIdPromise}
  <Loader />
{:then usersById}
  {#each orders as order}
    {@const user = usersById[order.userId] || null}
    <div class="order fullw">
      <OrderInfo order={order} services={services} />
      <hr>
      <div class="user">
        <span class="user-prop">Имя:</span>
        <span class="user-val">{user?.name || '---'}</span>
        <span class="user-prop">Телефон:</span>
        <span class="user-val">
          {#if user?.phone}
            <a class="phone-link" href="tel:{user?.phone}">
              {user?.phone}
            </a>
          {:else}
            ---          
          {/if}
        </span>
      </div>
      <div class="fullw controls">
        <!-- <button class="outline-btn controls-btn" on:click={() => {}}>Отменить</button> -->
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

  .user {
    padding: 8px 0;
    margin: 8px;
    display: grid;
    column-gap: 8px;
    row-gap: 4px;
    grid-template-columns: min-content auto;
    align-items: center;
    justify-content: flex-start;
  }
  
  .user-prop {
    font-weight: 800;
  }

  .order {
    border-radius: 8px;
    border: 1px solid var(--color-text);
    margin-bottom: 12px;
    overflow: hidden;
  }
</style>