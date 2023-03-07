<script lang="ts">

  import { getAllCategories } from "../api/categories"
  import { deleteService, getAllServices  } from "../api/services"
  import type { Service } from "../models/Service"
  import Loader from "../components/Loader.svelte";
  import BackToMenu from "../components/BackToMenu.svelte";
  import { goTo } from "../stores/routes";
  import type { Category } from "../models/Category";
  import ServiceInfo from "../components/ServiceInfo.svelte";

  type ServiceByCategoryId = {[key: string]: Service[]}
  let both = fetchServicesAndCategories()

  function fetchServicesAndCategories() {
    return Promise.all([
      getAllCategories(), 
      getAllServices()
    ]).then(([categories, services]) => {
      const servicesByCategoryId = {}
      for(const {id} of categories) {
        servicesByCategoryId[id] = []
      }
      for(const service of services) {
        if(Array.isArray(servicesByCategoryId[service.categoryId])) {
          servicesByCategoryId[service.categoryId].push(service)
        }
      }
      return [
        categories,
        servicesByCategoryId,
      ]
    }) as Promise<[Category[], ServiceByCategoryId]>
  }

  function handleDeleteService(serviceId: string) {
    return function() {
      both = deleteService(serviceId).then(
        fetchServicesAndCategories
      )
    }
  }
</script>

{#await both}
  <Loader />
{:then [categories, servicesByCategoryId]}
  <div class="services-list fullw">
    <h3 class="page-title">Список услуг</h3>
    {#each categories as category}
      <div class="category">
        <h4> {category.name} ({category.priority})</h4>
        {#if servicesByCategoryId[category.id]}
          <ul>
            {#each servicesByCategoryId[category.id] as service}
              <li class='service-item'>
                <ServiceInfo service={service} />
                <button on:click={handleDeleteService(service.id)}>X</button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
    <button class="fullw" on:click={goTo.NewCategory}>Новая категория</button>
    <button 
      class="fullw"
      class:disabled-btn={categories.length === 0}
      disabled={categories.length === 0} 
      on:click={goTo.NewService}
    >Новая услуга</button>  
  </div>
{/await}
<BackToMenu />

<style>
  .category {
    margin-bottom: 20px;
  }

  .category ul, .category h4 {
    margin: 0;
  }

  .category h4 {
    margin-bottom: 8px;
  }

  .category ul {
    list-style: square;
  }

  .service-item {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .services-list button {
    margin-bottom: 12px;
  }
</style>