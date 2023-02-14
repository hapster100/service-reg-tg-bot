<script lang="ts">
  import { addCategory } from "../api/categories";
  import CategoryForm from "../components/CategoryForm.svelte";
  import { goTo } from "../stores/routes";

  async function handleSubmit({detail: category}) {
    await addCategory(category)
    goTo.ServicesList()
  }
</script>
 
<div class="new-category fullw">
  <h3 class="page-title">Новая категория</h3>
  <CategoryForm on:submit={handleSubmit} />
</div>
<button class="outline-btn fullw" on:click={goTo.ServicesList}>К услугам</button>

<style>
  .new-category {
    margin-bottom: 12px;
  }
</style>
