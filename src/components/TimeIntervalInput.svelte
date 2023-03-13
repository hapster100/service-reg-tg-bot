<script lang="ts">
  import { createEventDispatcher } from "svelte";


  export let min = 0
  export let max = 24*60
  export let start: number
  export let end: number
  export let stepMinutes = 30
  
  let times = [] as number[]

  const dispatch = createEventDispatcher<{
    'change': {start: number, end: number}
  }>()

  $: {
    times = []
    for(let i = min; i <= max; i+=stepMinutes) {
      times.push(i)
    }
  }

  function format(minutes: number) {
    const h = Math.floor(minutes/60).toFixed(0).padStart(2, '0')
    const m = (minutes%60).toFixed(0).padStart(2, '0')
    return `${h}:${m}`
  }

  function handleStart(e: Event) {
    const target = e.target as HTMLSelectElement
    start = +target.value as number
    dispatch('change', { start, end })
  }

  function handleEnd(e: Event) {
    const target = e.target as HTMLSelectElement
    end = +target.value as number
    dispatch('change', { start, end })
  }

</script>

<div class="interval-field">
  <select value={start} class="select mr-12" on:change={handleStart}>
    {#each times.filter(x => x < end) as time}
      <option value={time}>
        {format(time)}
      </option>
    {/each}
  </select>
  <select value={end} class="select" on:change={handleEnd}>
    {#each times.filter(x => x > start) as time}
      <option value={time}>
        {format(time)}
      </option>
    {/each}
  </select>
</div>

<style>
  .interval-field {
    display: flex;
    align-items: center;
  }

  .interval-field
  
  .select {
    max-width: 80px;
    height: 48px;
    background-color: var(--color-bg);
    padding: 8px;
  }

  .mr-12 {
    margin-right: 12px;
  }

</style>
