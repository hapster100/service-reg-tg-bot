<script lang="ts">

  import { getAllCategories } from "../api/categories"
  import { getAllServices  } from "../api/services"
  import type { Service } from "../models/Service"
  import Loader from "../components/Loader.svelte";
  import BackToMenu from "../components/BackToMenu.svelte";
  import { goTo, goToWithState } from "../stores/routes";
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
</script>

{#await both}
  <Loader />
{:then [categories, servicesByCategoryId]}
  <div class="services-list fullw">
    <h3 class="page-title">Список услуг</h3>
    {#each categories as category}
      <div class="category"> 
        <div class="item-row">
          <h4 class="category-info">{category.name} ({category.priority})</h4>
          <button class="edit-btn" on:click={goToWithState.EditCategory({ category })}>
            <span class="material-symbols-outlined">
              edit
            </span>
          </button>
        </div>
        {#if servicesByCategoryId[category.id]}
          <ul>
            {#each servicesByCategoryId[category.id] as service}
              <li class='item-row'>
                <ServiceInfo service={service} />
                <button class="edit-btn" on:click={goToWithState.EditService({ service })}>
                  <span class="material-symbols-outlined">
                    edit
                  </span>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
    <button class="fullw mb-12" on:click={goTo.NewCategory}>Новая категория</button>
    <button 
      class="fullw mb-12"
      class:disabled-btn={categories.length === 0}
      disabled={categories.length === 0} 
      on:click={goTo.NewService}
    >Новая услуга</button>  
  </div>
{/await}
<BackToMenu />

<style>

  .edit-btn {
    margin-left: 12px;
    height: 32px;
    width: 32px;
  }
  .category {
    margin-bottom: 20px;
  }

  .category ul {
    margin: 0;
    list-style: square;
  }

  .item-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .category-info {
    margin: 0;
  }

  .mb-12 {
    margin-bottom: 12px;
  }

</style>