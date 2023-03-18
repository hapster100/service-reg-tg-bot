<script lang="ts">
  import { getSlots } from '../../api/orders';
  import { getAllServices } from '../../api/services';
  import { getUser } from '../../api/users';
  import type { Service } from '../../models/Service';
  import type { Time } from '../../models/Time';
  import { OrderStep, OrderStore } from '../../stores/newOrder'
  import { goTo } from '../../stores/routes';
  import Loader from '../Loader.svelte';

  export let store: OrderStore

  const {
    currentStep, daySlots, slotsCache,
    time, day, year, month,
    serviceIds, orderId
  } = store

  let process = false

  async function handle(time: Time) {
    $time = time
    process = true

    const user = await getUser(store.userId)

    if (!user?.phone || !user.name) {
      $currentStep = OrderStep.Profile
    } else {
      try {
        await store.makeOrder()
      } finally {
        process = false
        if (orderId) {
          goTo.Shedulle()
        } else {
          $currentStep = OrderStep.Success
        }
      }
    }

  }

  function handleChangeDay(date: Date) {
    return function () {
      $day = date.getDate()
      $month = date.getMonth()
      $year = date.getFullYear()
      $daySlots = $slotsCache[date.getFullYear()]?.[date.getMonth()]?.[date.getDate()] || []
    }
  }

  async function updateCache(year: number, month: number) {
    const services = await getAllServices()
    const serviceById = services.reduce((acc, s) => (acc[s.id] = s, acc), {} as {[key: string]: Service})
    const duration = $serviceIds.map(id => serviceById[id].durationMinutes).reduce((a, b) => a + b, 0)
    const slots = await getSlots(year, month, duration, orderId)
    slotsCache.update(cache => ({
      ...cache,
      [year]: {
        ...(cache[year] || {}),
        [month]: slots,
      }
    }))
  }

  let currDay: Date
  let prevDay: Date|null = null
  let nextDay: Date|null = null

  let nextMonth: Date
  let prevMonth: Date
  
  $: {
    currDay = new Date($year, $month, $day)
    nextMonth = new Date($year, $month + 1, 1)
    prevMonth = new Date($year, $month - 1, 1)
  }
  

  $: {
    for(const date of [nextMonth, prevMonth]) {
      const month = date.getMonth()
      const year = date.getFullYear()
      const cache = $slotsCache[year]?.[month]
      if (!cache) {
        updateCache(year, month)
      }
    }
  }

  $: {
    const days = [prevMonth, currDay, nextMonth]
      .flatMap(date => {
        const month = date.getMonth()
        const year = date.getFullYear()
        const cache = $slotsCache[year]?.[month]

        if (cache === null || cache === undefined) return []
        
        const days = Object.keys(cache).map(Number)
        return days
          .filter(day => cache[day].length > 0)
          .map(day => new Date(year, month, day))
      })
    
    let newNext: Date|null = null
    let newPrev: Date|null = null

    for(const date of days) {
      if (date > currDay) {
        if (!newNext) newNext = date
        if (newNext > date) newNext = date
      }
      if (date < currDay) {
        if (!newPrev) newPrev = date
        if (newPrev < date) newPrev = date
      }
    }

    prevDay = newPrev
    nextDay = newNext
  }

</script>

<h3 class="page-title">Выбор времени</h3>
{#if process}
  <Loader />
{:else}
  <div class="change-day mb-12">
    <button  class="change-day-btn"
      class:disabled-btn={!prevDay}
      on:click={prevDay ? handleChangeDay(prevDay) : null}
    >
      {'<'}
    </button>
    <div class="current-day">
      {currDay.toLocaleString('ru', { day: 'numeric', month: 'long'})}
    </div>
    <button class="change-day-btn"
      class:disabled-btn={!nextDay}
      on:click={nextDay ? handleChangeDay(nextDay) : null}
    >
      {'>'}
    </button>
  </div>
  <div class="select-time mb-20">
    {#each $daySlots as slot}
      <button class="outline-btn time-slot" on:click={() => handle(slot)}>
        {slot}
      </button>
    {/each}
  </div>
{/if}
<button class="fullw" on:click={() => $currentStep = OrderStep.Date}>Назад</button>

<style>

  .current-day {
    flex: 2;
    border: 1px solid var(--color-text);
    border-right: 0;
    border-left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .change-day-btn {
    flex: 1;
  }

  .change-day-btn:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .change-day-btn:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .change-day {
    width: 100%;
    padding: 2px 0;
    display: flex;
    flex-direction: row;
  }
  .select-time {
    display: grid;
    grid-template-columns: repeat(4, calc((100% - 24px)/4));
    gap: 8px;
  }
</style>
