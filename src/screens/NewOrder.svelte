<script lang="ts">
  import { writable, type Writable } from "svelte/store"
  import { getAllCategories } from "../api/categories"
  import { getAllServices } from "../api/services"
  import type { Service as ServiceType } from "../models/Service"
  import type { Category } from '../models/Category'
  import SelectServices from "../components/newOrder/SelectServices.svelte";
  import { current, OrderStep } from "../stores/newOrder";
  import SelectDate from "../components/newOrder/SelectDate.svelte";
  import SelectTime from "../components/newOrder/SelectTime.svelte";
  import Loader from "../components/Loader.svelte";
  import BackToMenu from "../components/BackToMenu.svelte";
  import SuccessOrder from "../components/newOrder/SuccessOrder.svelte";
  
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
    {#if $current === OrderStep.Services}
      <SelectServices services={services} categories={categories} />
    {:else if $current === OrderStep.Date}
      <SelectDate services={services} />
    {:else if $current === OrderStep.Time}
      <SelectTime />
    {:else if $current === OrderStep.Success}
      <SuccessOrder />
    {/if}
  {/await}
</div>
<BackToMenu />

<style>
  .new-order {
    margin-bottom: 12px;
  }
</style>
