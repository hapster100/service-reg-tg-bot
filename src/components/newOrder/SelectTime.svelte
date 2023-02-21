<script lang="ts">
  import { onMount } from 'svelte';
  import { getSlots } from '../../api/orders';
  import { getAllServices } from '../../api/services';
  import type { Service } from '../../models/Service';
  import type { Time } from '../../models/Time';
  import { OrderStep, OrderStore } from '../../stores/newOrder'
  import Loader from '../Loader.svelte';

  export let store: OrderStore

  const {
    currentStep, daySlots, slotsCache,
    makeOrder, time, day, year, month, serviceIds
  } = store

  let process = false

  async function handle(time: Time) {
    $time = time
    process = true
    try {
      await store.makeOrder()
    } finally {
      process = false
      $currentStep = OrderStep.Success
    }
  }

  let dates = [] as any[]

  let btns = [] as {
    date: Date
    current: boolean
    disabled: boolean
    click: EventListener
  }[]
  
  let scrollInner: HTMLDivElement
  let scrollOuter: HTMLDivElement
  onMount(() => {
    scrollOuter.scrollLeft = (-scrollOuter.clientWidth + scrollInner.clientWidth)/2
  })

  $: {
    dates = new Array(9).fill(0).map((_, i) => new Date($year, $month, $day + i - 4))
    btns = dates.map(date => {
      const slots = $slotsCache[date.getFullYear()]?.[date.getMonth()]?.[date.getDate()]
      return {
        date,
        current: date.getDate() === $day,
        disabled: !slots || slots.length === 0,
        click: () => {
          $day = date.getDate()
          $month = date.getMonth()
          $year = date.getFullYear()
          $daySlots = slots || []
        }
      }
    })
    const updateCache = async (year: number, month: number) => {
      const services = await getAllServices()
      const serviceById = services.reduce((acc, s) => (acc[s.id] = s, acc), {} as {[key: string]: Service})
      const duration = $serviceIds.map(id => serviceById[id].durationMinutes).reduce((a, b) => a + b, 0)
      const slots = await getSlots(year, month, duration)
      slotsCache.update(cache => ({
        ...cache,
        [year]: {
          ...(cache[year] || {}),
          [month]: slots,
        }
      }))
    }

    for(const date of dates) {
      const month = date.getMonth()
      const year = date.getFullYear()
      const cache = $slotsCache[year]?.[month]
      if (!cache) {
        updateCache(year, month)
      }
    }
  }

</script>

<h3 class="page-title">Выбор времени</h3>
{#if process}
  <Loader />
{:else}
  <div bind:this={scrollOuter} class="change-day-scroll">
    <div bind:this={scrollInner} class="change-day">
      {#each btns as {current, disabled, date, click}}  
        <button
          class="day-btn"
          class:disabled-btn={disabled}
          class:outline-btn={current}
          class:current-day={current}
          disabled={disabled || current}
          on:click={click}
        >{date.toLocaleString('ru', {
          day: 'numeric',
          month: '2-digit',
        })}</button>
      {/each}
    </div>
  </div>
  <div class="select-time">
    {#each $daySlots as slot}
      <button class="outline-btn time-slot" on:click={() => handle(slot)}>
        {slot}
      </button>
    {/each}
  </div>
{/if}
<button class="fullw" on:click={() => $currentStep = OrderStep.Date}>Назад</button>

<style>

  
  .day-btn {
    flex: 1;
    margin-right: 2px;
  }
  .day-btn:last-child {
    margin-right: 0;
  }

  .day-btn.current-day {
    flex: 1;
    border: 0;
  }

  .change-day-scroll {
    overflow-x: scroll;
    margin-bottom: 12px;
  }
  .change-day {
    padding: 2px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: center;
  }
  .select-time {
    display: grid;
    grid-template-columns: repeat(4, calc((100% - 24px)/4));
    margin-bottom: 20px;
    gap: 8px;
  }
</style>
