<script lang="ts">
  import { writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  import type { Category } from "../models/Category";
  import type { Service } from "../models/Service";
  import Time from "./Time.svelte";
  import type { NoId } from "../api/base";

  export let categories: Category[]

  const STEP = 15

  const categoryId = writable(categories[0]?.id || '')
  const name = writable('')
  const imageUrl = writable('')
  const durationMinutes = writable(STEP)
  const cost = writable(0)

  const dispatch = createEventDispatcher<{
    'submit': NoId<Service>
  }>()

  const handler = (e: SubmitEvent) => {
    e.preventDefault()
    const detail : NoId<Service> = {
      categoryId: $categoryId,
      name: $name,
      imageUrl: $imageUrl,
      durationMinutes: $durationMinutes,
      cost: $cost,
    }
    dispatch('submit', detail)

    $categoryId = categories[0]?.id || ''
    $name = ''
    $imageUrl = ''
    $durationMinutes = STEP
    $cost = 0
  }

</script>
<div class="fullw">
  <form class="form" on:submit={handler}>
    <div class="form-field">
      <label for="name">Название</label>
      <input type="text" name="name" bind:value={$name}/>
    </div>
  
    <div class="form-field">
      <label for="category">Категория</label>
      <select name="category" bind:value={$categoryId}>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>
  
    <div class="form-field">
      <label for="url">Url картинки</label>
      <input type="text" name="url" bind:value={$imageUrl}/>
    </div>
  
    <div class="form-field">
      <label for="duration">Длительность</label>
      <input type="range" name="duration" 
        min={STEP} max="360" step={STEP}
        bind:value={$durationMinutes}
      />
      <Time duration={$durationMinutes} />
    </div>
  
    <div class="form-field">
      <label for="cost">Стоимость</label>
      <input type="number" name="cost" bind:value={$cost} />
    </div>

    <button type="submit">Добавить</button>
  </form>
</div>
