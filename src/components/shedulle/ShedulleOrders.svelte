<script lang="ts">
  import { getUsers } from "../../api/users";
  import type { Order } from "../../models/Order";
  import type { Service } from "../../models/Service";
  import type { User } from "../../models/User";
  import { userId } from "../../stores/user";
  import Loader from "../Loader.svelte";
  import OrderInfo from "../OrderInfo.svelte";


  export let orders: Order[]
  export let services: Service[]

  const usersByIdPromise = getUsers([
    ...new Set(orders.map(order => order.userId))
  ]).then(users => users.reduce((acc, user) => (acc[user.id] = user, acc), {} as {[key: string]: User}))

</script>

{#await usersByIdPromise}
  <Loader />
{:then usersById}
  {#each orders as order}
    <div class="order fullw">
      <OrderInfo order={order} services={services} />
      <hr>
      <div class="user">
        <span class="user-prop">Имя:</span>
        <span class="user-val">{usersById[order.userId]?.name || '---'}</span>
        <span class="user-prop">Телефон:</span>
        <span class="user-val">
          {#if usersById[order.userId]?.phone}
            <a class="phone-link" href="tel:{usersById[order.userId]?.phone}">
              {usersById[order.userId]?.phone}
            </a>
          {:else}
            ---          
          {/if}
        </span>
      </div>
    </div>
  {/each}
{/await}

<style>
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
    border: 1px solid black;
    margin-bottom: 12px;
    overflow: hidden;
  }
</style>