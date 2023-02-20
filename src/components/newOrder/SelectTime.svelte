<script lang="ts">
  import type { Time } from '../../models/Time';
  import { 
    current, OrderStep, daySlots,
    makeOrder, time, 
  } from '../../stores/newOrder'
  import Loader from '../Loader.svelte';

  let process = false

  async function handle(time: Time) {
    $time = time
    process = true
    try {
      await makeOrder()
    } finally {
      process = false
      $current = OrderStep.Success
    }
  }
</script>

<h3 class="page-title">Выбор времени</h3>
{#if process}
  <Loader />
{:else}
  <div class="select-time">
    {#each $daySlots as slot}
      <button class="outline-btn time-slot" on:click={() => handle(slot)}>
        {slot}
      </button>
    {/each}
  </div>
{/if}
<button class="fullw" on:click={() => $current = OrderStep.Date}>Назад</button>

<style>
  .select-time {
    display: grid;
    grid-template-columns: repeat(4, calc((100% - 24px)/4));
    margin-bottom: 20px;
    gap: 8px;
  }
</style>
