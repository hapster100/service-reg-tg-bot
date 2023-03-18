<script lang="ts">
  import { writable } from 'svelte/store';
  import { getSlots } from '../../api/orders';
  import type { Service } from '../../models/Service';
  import type { Time } from '../../models/Time';
  import { OrderStep, OrderStore } from '../../stores/newOrder'
  import Calendar from '../Calendar.svelte';
  
  export let services: Service[]
  export let store: OrderStore

  const {
    year, month, serviceIds, slotsCache,
    currentStep, day, daySlots, orderId
  } = store

  const serviceDuration = services.reduce((acc, s) => (acc[s.id] = s.durationMinutes, acc), {})
  const slots = writable({} as {[key: number]: Time[]})
  
  type CellData = { class: string, active: boolean }
  
  const days = writable({} as {[key: number]: CellData})
  $: {
    const numDays = new Date(Date.UTC($year, $month+1, 0)).getDate()
    let minDay = 0

    if ($year === new Date().getFullYear() && $month === new Date().getMonth()) {
      minDay = new Date().getDate()
    }

    const newDays = {} as {[key: number]: CellData}
    for(let d = 1; d <= numDays; d++) {
      const active = $slots[d]?.length > 0
      newDays[d] = {
        active,
        class: active ? 'active' : 'not-active',
      }
    }
    $days = newDays
  }

  function nextMonth() {
    if ($month === 11) {
      month.set(0)
      year.set($year + 1)
    } else {
      month.set($month + 1)
    }
    updateSlots()
  }

  function prevMonth() {
    if ($month === 0) {
      month.set(11)
      year.set($year - 1)
    } else {
      month.set($month - 1)
    }
    updateSlots()
  }
  
  async function updateSlots() {
    const cache = $slotsCache[$year]?.[$month]
    if (cache) {
      $slots = cache
      return;
    }
    $slots = {}
    const duration = $serviceIds.reduce((acc, id) => acc + serviceDuration[id], 0)
    const newSlots = await getSlots($year, $month, duration, orderId)
    $slots = newSlots
    slotsCache.update(cache => {
      return {
        ...cache,
        [$year]: {
          ...(cache[$year] || {}),
          [$month]: $slots
        }
      }
    })
  }

  function selectDay(day: number) {
    $day = day
    $daySlots = $slots[day]
    $currentStep = OrderStep.Time
  }

  updateSlots()

</script>

<h3 class="page-title">Выбор даты</h3>
<Calendar 
  year={$year}
  month={$month}
  days={$days}
  on:next={nextMonth}
  on:prev={prevMonth}
  on:click={({ detail }) => selectDay(detail.day)}
>
  <style>
    .active {
      color: var(--color-bg);
      background-color: var(--color-text);
      padding: 0;
      margin: 0;
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border-radius: 0;
      font-size: 100%;
    }

    .calendar-row:last-child .calendar-cell:first-child .active {
      border-bottom-left-radius: 8px;
    }


    .calendar-row:last-child .calendar-cell:last-child .active {
      border-bottom-right-radius: 8px;
    }

    .not-active {
      color: grey;
      cursor: not-allowed;
    }
  </style>
</Calendar>
<button class="fullw" on:click={() => $currentStep = OrderStep.Services}>Назад</button>
