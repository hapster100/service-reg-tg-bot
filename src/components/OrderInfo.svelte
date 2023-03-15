<script lang="ts">
  import type { Order } from "../models/Order";
  import { Service } from "../models/Service";
  import { Time } from "../models/Time";
  import ServiceInfo from "./ServiceInfo.svelte";

  export let order: Order
  export let services: Service[]
  
  const serviceById = services.reduce((acc, s) => (acc[s.id] = s, acc), {} as {
    [key: string]: Service
  })
  const deletedService = new Service({
    id: '',
    name: 'Услуга удалена',
    categoryId: '',
    cost: 0,
    durationMinutes: 0,
    imageUrl: '',
  })
  const totalTime = order.serviceIds.reduce(
    (t, id) => t + (serviceById[id] || deletedService).durationMinutes, 0
  )
  const endTime = Time.fromMinutes(order.time.toMinutes() + totalTime)

</script>

<div class="order-date-time fullw">
  <span class="time">
    {order.time} - {endTime}
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
    {@const service = serviceById[serviceId] || deletedService}
    <ServiceInfo service={service} />
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
