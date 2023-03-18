<script lang="ts">
  import { onMount } from "svelte";
  import { getInfo, updateInfo } from "../api/masters";
  import BackToMenu from "../components/BackToMenu.svelte";
  import ImageUrlInput from "../components/ImageUrlInput.svelte";
  import Loader from "../components/Loader.svelte";
  import Time from "../components/Time.svelte";
  import { MasterInfo } from "../models/MasterInfo";
  
  const STEP = 15

  let process = true
  let imageUrl = ''
  let address = ''
  let shedulleStep = 15

  const update = async () => {
    process = true
    await getInfo().then(info => {
      imageUrl = info.successImageUrl
      address = info.address
      shedulleStep = info.shedulleStep
      process = false
    })
  }


  const handle = async (e: SubmitEvent) => {
    e.preventDefault()
    const info = new MasterInfo({
      address,
      successImageUrl: imageUrl,
      shedulleStep
    })
    process = true
    await updateInfo(info)
    await update()
    process = false
  }

  onMount(update)

</script>

{#if process}
  <Loader />
{:else}
  <form class="fullw mb-12 form" on:submit={handle}>
    <div class="form-field">
      <label for="address">Адрес</label>
      <input type="text" id="address" bind:value={address} />
    </div>
    <div class="form-field">
      <label for="image">Картинка в уведомлении</label>
      <ImageUrlInput bind:imageUrl />
    </div>
    <div class="form-field">
      <label for="time-step">Шаг в расписании</label>
      <input type="range" name="duration" 
        min={STEP} max={STEP*4} step={STEP}
        bind:value={shedulleStep}
      />
      <Time duration={shedulleStep} />
    </div>
    <button type="submit">Сохранить</button>
  </form>
{/if}

<style>
  .mb-12 {
    margin-bottom: 12px;
  }
</style>


<BackToMenu />
