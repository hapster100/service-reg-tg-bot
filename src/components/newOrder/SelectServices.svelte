<script lang="ts">
  import { writable } from "svelte/store"
  import type { Category } from "../../models/Category"
  import type { Service } from "../../models/Service"
  import { current, OrderStep, serviceIds } from "../../stores/newOrder"
  import ServiceInfo from "../ServiceInfo.svelte"
  import ServicesList from '../SirvicesList.svelte'
  import Time from "../Time.svelte";

  export let services : Service[]
  export let categories : Category[]

  let serviceById = {} as {[key: string]: Service}
  let listOpen = writable($serviceIds.length === 0)
  let totalCost = 0
  let totalDuration = 0

  $: {
    serviceById = services.reduce((acc, s) => (acc[s.id] = s, acc), {})
  }

  $: {
    totalCost = $serviceIds.reduce((acc, id) => serviceById[id]?.cost + acc, 0)
    totalDuration = $serviceIds.reduce((acc, id) => serviceById[id]?.durationMinutes + acc, 0)
  }


  function remove(serviceId: string) {
    const i = $serviceIds.findIndex(x => x === serviceId)
    if (i >= 0) {
      const next = [...$serviceIds.slice(0, i), ...$serviceIds.slice(i + 1)]
      $serviceIds = next
    }
  }
  
  function add({ detail: serviceId }) {
    const next = [...$serviceIds, serviceId]
    $serviceIds = [...new Set(next)]
    $listOpen = false
  }

</script>

{#if $listOpen}
  <h3 class="page-title">Выбор услуги</h3>
  <ServicesList 
    services={services.filter(s => !$serviceIds.includes(s.id))}
    categories={categories}
    on:select={add} 
  />
  <button class="fullw" on:click={() => $listOpen = false}>К списку</button>
{:else}
  <h3 class="page-title">Выбранные услуг</h3> 
  {#each $serviceIds as serviceId}
    <div class='service-info-wrapper'>
      <ServiceInfo service={serviceById[serviceId]}/>
      <button on:click={() => remove(serviceId)}>⨯</button>
    </div>
  {/each}
  <div class="new-order-total">
    Итого: {totalCost}руб. <Time duration={totalDuration}/>
  </div>
  <div class="new-order-ctrl">
    <button on:click={() => $listOpen = true}>Добавить еще</button>
    <button on:click={() => $current = OrderStep.Date}>Далее</button>
  </div>
{/if}

<style>
  .service-info-wrapper {
    box-sizing: border-box;
    margin: auto;
    width: calc(100% - 8px);
    margin-bottom: 8px;
    border: 1px solid black;
    border-radius: 8px;
    display: flex;
  }
  .service-info-wrapper  button {
    aspect-ratio: 1;
    font-size: 150%;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .new-order-total {
    font-size: 0.8rem;
    margin: 12px;
  }

  .new-order-ctrl {
    display: flex;
    flex-direction: row;
  }

  .new-order-ctrl button {
    flex: 1;
    margin: 4px 4px;
  }

  .new-order-ctrl button:last-child {
    margin-right: 0;
  }

  .new-order-ctrl button:first-child {
    margin-left: 0;
  }
</style>