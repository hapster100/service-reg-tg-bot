<script lang="ts">
  import { writable } from "svelte/store"
  import { getAllCategories } from "../api/categories"
  import { getAllServices } from "../api/services"
  import type { Service as ServiceType } from "../models/Service"
  import type { Category } from '../models/Category'
  import SelectServices from "../components/newOrder/SelectServices.svelte";
  import SelectDate from "../components/newOrder/SelectDate.svelte";
  import SelectTime from "../components/newOrder/SelectTime.svelte";
  import Loader from "../components/Loader.svelte";
  import BackToMenu from "../components/BackToMenu.svelte";
  import SuccessOrder from "../components/newOrder/SuccessOrder.svelte";
  
  import { OrderStore, OrderStep } from '../stores/newOrder'
  import { onDestroy, onMount } from "svelte";
  
  const { order } = history.state
  const store = new OrderStore(order)

  onMount(() => {
    store.init()
  })

  onDestroy(() => {
    store.destroy()
  })

  const { currentStep } = store

  const serviceById = writable({} as {[key: string]: ServiceType})
  const categoryById = writable({} as {[key: string]: Category})

  const servicesPromise = getAllServices()
  const categoriesPromise = getAllCategories()

  const both = Promise
    .all([servicesPromise, categoriesPromise])
    .then(([ss, cs]) => {
      
      $serviceById = ss.reduce((acc, s) => (acc[s.id] = s, acc), {})
      $categoryById = cs.reduce((acc, c) => (acc[c.id] = c, acc), {})

      return [ss, cs] as [ServiceType[], Category[]]
    })

</script>

<div class="new-order fullw">
  {#await both} 
    <Loader />
  {:then [services, categories]}
    {#if $currentStep === OrderStep.Services}
      <SelectServices store={store} services={services} categories={categories} />
    {:else if $currentStep === OrderStep.Date}
      <SelectDate store={store} services={services} />
    {:else if $currentStep === OrderStep.Time}
      <SelectTime store={store} />
    {:else if $currentStep === OrderStep.Success}
      <SuccessOrder store={store} />
    {/if}
  {/await}
</div>
<BackToMenu />

<style>
  .new-order {
    margin-bottom: 12px;
  }
</style>
