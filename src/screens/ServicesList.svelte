<script lang="ts">

  import { getAllCategories } from "../api/categories"
  import { getAllServices  } from "../api/services"
  import type { Service } from "../models/Service"
  import Loader from "../components/Loader.svelte";
  import BackToMenu from "../components/BackToMenu.svelte";
  import { goTo } from "../stores/routes";
  import type { Category } from "../models/Category";
  import ServiceInfo from "../components/ServiceInfo.svelte";

  type ServiceByCategoryId = {[key: string]: Service[]}
  let both = Promise.all([
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
              <li>
                <ServiceInfo service={service} />
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
    <button class="fullw" on:click={goTo.NewCategory}>Новая категория</button>
    <button class="fullw" on:click={goTo.NewService}>Новая услуга</button>  
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

  .services-list button {
    margin-bottom: 12px;
  }
</style>