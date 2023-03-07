<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import type { NoId } from '../api/base'
  import type { Category } from "../models/Category";

  const name = writable('');
  const priority = writable(0);
  
  const dispatch = createEventDispatcher<{
    'submit': NoId<Category>
  }>()

  const handler = (e: Event) => {
    e.preventDefault()
    dispatch('submit', {
      name: $name,
      priority: $priority,
    })
    $name = ''
  }

  let valid = false

  $: valid = $name.length > 0

</script>

<div class="fullw">
  <form class="form" on:submit={handler}>
    <div class="form-field">
      <label for="name">Название</label>
      <input type="text" id="name" bind:value={$name} />
    </div>
    <div class="form-field">
      <label for="priority">Приоритет</label>
      <input type="number" id="priority" bind:value={$priority} />
    </div>
    <button disabled={!valid} class:disabled-btn={!valid} type="submit">Добавить</button>
  </form>
</div>
