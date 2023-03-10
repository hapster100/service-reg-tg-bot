<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Category } from "../models/Category";
  import type { Service } from "../models/Service";
  import Time from "./Time.svelte";
  import type { NoId } from "../api/base";
  import ImageUrlInput from "./ImageUrlInput.svelte";
  export let categories: Category[]

  const STEP = 15

  export let categoryId = categories[0]?.id || ''
  export let name = ''
  export let imageUrl = ''
  export let durationMinutes = STEP
  export let cost = 0

  const dispatch = createEventDispatcher<{
    'submit': NoId<Service>
  }>()

  let handler = (e: SubmitEvent) => {
    e.preventDefault()
    const detail : NoId<Service> = {
      categoryId,
      name,
      imageUrl,
      durationMinutes,
      cost,
    }
    dispatch('submit', detail)

    categoryId = categories[0]?.id || ''
    name = ''
    imageUrl = ''
    durationMinutes = STEP
    cost = 0
  }

  let valid = false

  $: valid = cost > 0 && name.length > 1 && durationMinutes > 0

</script>

<div class="fullw">
  <form class="form" on:submit={handler}>
    <div class="form-field">
      <label for="name">Название</label>
      <input type="text" name="name" bind:value={name}/>
    </div>
  
    <div class="form-field">
      <label for="category">Категория</label>
      <select name="category" bind:value={categoryId}>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>
  
    <div class="form-field">
      <label for="url">Картинка</label>
      <ImageUrlInput bind:imageUrl />
    </div>
  
    <div class="form-field">
      <label for="duration">Длительность</label>
      <input type="range" name="duration" 
        min={STEP} max="360" step={STEP}
        bind:value={durationMinutes}
      />
      <Time duration={durationMinutes} />
    </div>
  
    <div class="form-field">
      <label for="cost">Стоимость</label>
      <input type="number" name="cost" bind:value={cost} />
    </div>

    <button disabled={!valid} class:disabled-btn={!valid} type="submit">Сохранить</button>
  </form>
</div>
