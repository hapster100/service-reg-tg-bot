<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import type { Category } from '../models/Category';
  import type { Service as ServiceType } from '../models/Service'
  import Service from "./Service.svelte";

  export let services: ServiceType[] = []
  export let categories: Category[] = []

  const servicesByCategories = {}

  categories.reduce((acc, cat) => (acc[cat.id] = [], acc), servicesByCategories)
  services.reduce((acc, service) => {
    acc[service.categoryId] = acc[service.categoryId] || []
    acc[service.categoryId].push(service)
    return acc
  }, servicesByCategories)

  let openCategory: Writable<string|null> = writable(null)

  const dispatch = createEventDispatcher()

  function handle(id) {
    dispatch('select', id)
  }

  function categoryClick(id: string) {
    if ($openCategory === id) {
      $openCategory = null
    } else {
      $openCategory = id
    }
  }

</script>

<div class="services-list">
  {#each categories as category}
    {#if servicesByCategories[category.id]?.length > 0}
      <button class='cat-btn' on:click={() => categoryClick(category.id)}>
        <span>{category.name}</span>
        <span class={'icon' + ($openCategory === category.id ? ' icon-open' : '')}></span>
      </button>
      {#if $openCategory === category.id}
        {#each servicesByCategories[category.id] as service }
          <div class="service-wrapper">
            <Service service={service} />
            <button class="fullw" on:click={() => handle(service.id)}>Выбрать</button>
          </div>
        {/each}
      {/if}
    {/if}
  {/each}
</div>

<style>
  .cat-btn {
    display: flex;
    background-color: var(--color-bg);
    color: var(--color-text);
    border-bottom: 1px solid var(--color-text);
    border-radius: 0;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .icon {
    transition: all 0.3s;
    display: inline-block;
    width: 10px;
    height: 10px;
    border-top: 2px solid var(--color-text);
    border-right: 2px solid var(--color-text);
    transform: rotate(135deg);
  }

  .icon-open {
    transform: rotate(-45deg);
  }

  .services-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .service-wrapper {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-text);
    margin-bottom: 20px;
  }

  .service-wrapper button {
    border-radius: 0;
    position: relative;
  }
</style>
