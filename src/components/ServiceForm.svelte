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

  const handleImage = (e: Event & { currentTarget: HTMLInputElement }) => {
    const file = e.currentTarget?.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const img = new Image()
        img.src = reader.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = 400
          canvas.height = 400

          let dx = 0, dy = 0, w = img.width, h = img.height
          
          if (w/h > 1) {
            dx = Math.floor(w/2 - h/2)
            w = h
          } else if (w/h < 1) {
            dy = Math.floor(h/2 - w/2)
            h = w
          }

          canvas.getContext('2d')?.drawImage(
            img, dx, dy, w, h,
            0, 0, canvas.width, canvas.height
          )
          
          
          $imageUrl = canvas.toDataURL()
        }
      });
      reader.readAsDataURL(file);
    }
  }

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

  let valid = false

  $: valid = $cost > 0 && $name.length > 1 && $durationMinutes > 0

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
      <label for="url">Картинка</label>
      <input type="file"
        id="image" name="image"
        accept="image/png, image/jpeg"
        on:change={handleImage}
      >
      {#if $imageUrl}
        <img class="img-preview" src={$imageUrl} alt="" />
      {/if}
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

    <button disabled={!valid} class:disabled-btn={!valid} type="submit">Добавить</button>
  </form>
</div>

<style>
  .form-field input[type="file"] {
    border: 0;
  }
  .img-preview {
    margin-top: 8px;
    width: 100%;
    object-fit: cover;
    aspect-ratio: 1.2;
  }
</style>
