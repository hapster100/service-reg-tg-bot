<script lang="ts">
  import type { Order } from "../models/Order";
  import type { Service } from "../models/Service";
  import ServiceInfo from "./ServiceInfo.svelte";

  export let order: Order
  export let services: Service[]
  
  const serviceById = services.reduce((acc, s) => (acc[s.id] = s, acc), {})
  
</script>

<div class="order-date-time fullw">
  <span class="time">
    {order.time}
  </span>
  <span class="date">
    {order.date.toLocaleString('ru', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}
  </span>
</div>
<div class="order-services fullw">
  {#each order.serviceIds as serviceId}
    <ServiceInfo service={serviceById[serviceId]} />
  {/each}
</div>

<style>
  .order-services {
    margin: 8px 0;
  }

  .order-date-time {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid var(--color-text);
    background-color: var(--color-text);
    color: var(--color-bg);
  }
</style>
