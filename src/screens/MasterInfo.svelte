<script lang="ts">
  import { onMount } from "svelte";
  import { getInfo, updateInfo } from "../api/masters";
  import BackToMenu from "../components/BackToMenu.svelte";
  import ImageUrlInput from "../components/ImageUrlInput.svelte";
  import Loader from "../components/Loader.svelte";
  import { MasterInfo } from "../models/MasterInfo";
  
  let process = true
  let imageUrl = ''
  let address = ''

  const update = async () => {
    process = true
    await getInfo().then(info => {
      imageUrl = info.successImageUrl
      address = info.address
      process = false
    })
  }


  const handle = async (e: SubmitEvent) => {
    e.preventDefault()
    const info = new MasterInfo({address, successImageUrl: imageUrl})
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
    <button type="submit">Сохранить</button>
  </form>
{/if}

<style>
  .mb-12 {
    margin-bottom: 12px;
  }
</style>


<BackToMenu />
