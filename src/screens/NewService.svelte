<script lang="ts">
  import { getAllCategories } from "../api/categories";
  import { addService } from "../api/services";
  import Loader from "../components/Loader.svelte";
  import ServiceForm from "../components/ServiceForm.svelte";
  import { goTo } from "../stores/routes";

  const categoriesPromise = getAllCategories()

  async function handleSubmit({detail: service}) {
    process = true
    await addService(service)
    goTo.ServicesList()
  }

  let process = false

</script>

{#await categoriesPromise}
  <Loader />
{:then categories}
  {#if process}
    <Loader />
  {:else}
    <div class="new-service fullw">
      <h3 class="page-title">Новая услуга</h3>
      <ServiceForm categories={categories} on:submit={handleSubmit} />
    </div>
  {/if}
{/await}

<button class="outline-btn fullw" on:click={goTo.ServicesList}>К услугам</button>


<style>
  .new-service {
    margin-bottom: 12px;
  }
</style>
