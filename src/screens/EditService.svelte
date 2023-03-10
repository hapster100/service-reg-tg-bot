<script lang="ts">
  import type { NoId } from "../api/base";
  import { getAllCategories } from "../api/categories";
  import { updateService, deleteService } from "../api/services";
  import Loader from "../components/Loader.svelte";
  import ServiceForm from "../components/ServiceForm.svelte";
  import { Service } from "../models/Service";
  import { goTo } from "../stores/routes";

  const { service } = history.state as { service: Service}
  if (!service) goTo.ServicesList()

  const categoriesPromise = getAllCategories()

  let process = false
  
  async function handleSubmit({detail: edited} : CustomEvent<NoId<Service>>) {
    process = true
    await updateService(new Service({ ...service, ...edited }))
    goTo.ServicesList()
  }

  async function handleDelete() {
    process = true
    await deleteService(service.id)
    goTo.ServicesList()
  }

</script>

{#await categoriesPromise}
  <Loader />
{:then categories}
  {#if process}
    <Loader />
  {:else}
    <div class="edit-service fullw">
      <h3 class="page-title">Изменение услуги</h3>
      <ServiceForm
        categories={categories}
        on:submit={handleSubmit}
        name={service.name}
        categoryId={service.categoryId}
        durationMinutes={service.durationMinutes}
        imageUrl={service.imageUrl}
        cost={service.cost}
      />
    </div>
  {/if}
{/await}
    
<button class="fullw delete-btn" on:click={handleDelete}>Удалить</button>
<button class="outline-btn fullw" on:click={goTo.ServicesList}>К услугам</button>


<style>
  .delete-btn {
    margin-bottom: 12px;
  }

  .edit-service {
    margin-bottom: 12px;
  }
</style>