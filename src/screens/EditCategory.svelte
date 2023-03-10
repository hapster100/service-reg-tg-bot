<script lang="ts">
  import { updateCategory, deleteCategory } from "../api/categories";
  import CategoryForm from "../components/CategoryForm.svelte";
  import type { NoId } from '../api/base';
  import { Category } from "../models/Category";
  import { goTo } from "../stores/routes";

  const { category } = history.state as { category: Category }
  if (!category) goTo.ServicesList()

  async function handleSubmit({detail: edited} : CustomEvent<NoId<Category>>) {
    await updateCategory(new Category({ ...category, ...edited }))
    goTo.ServicesList()
  }

  async function handleDelete() {
    await deleteCategory(category.id)
    goTo.ServicesList()
  }

</script>
 
<div class="edit-category fullw">
  <h3 class="page-title">Изменение категории</h3>
  <CategoryForm
    on:submit={handleSubmit}
    name={category.name}
    priority={category.priority}
  />
</div>
<button class="fullw delete-btn" on:click={handleDelete}>Удалить</button>
<button class="outline-btn fullw" on:click={goTo.ServicesList}>К услугам</button>

<style>
  .delete-btn {
    margin-bottom: 12px;
  }

  .edit-category {
    margin-bottom: 12px;
  }
</style>
