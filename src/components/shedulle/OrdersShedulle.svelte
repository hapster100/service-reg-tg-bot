<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Order } from "../../models/Order";
  import type { Service } from "../../models/Service";
  import type { Shedulle } from "../../models/Shedulle";
  import type { CellT, WithDay } from "../Calendar.svelte";
  import Calendar from "../Calendar.svelte";
  
  export let year: number
  export let month: number

  export let orders: Order[]
  export let services: Service[]
  export let shedulle: Shedulle

  const dispatch = createEventDispatcher<{
    'click': WithDay
    'next': undefined
    'prev': undefined
  }>()

  function getDays(orders: Order[], services: Service[], shedulle: Shedulle) {

const durationByServiceId = services.reduce((acc, service) => {
  acc[service.id] = service.durationMinutes
  return acc
}, {})

const durationByDay = orders.reduce((acc, order) => {
  const day = order.date.getDate()
  acc[day] = acc[day] || 0 
  acc[day] += order.serviceIds.reduce((sum, id) => sum + durationByServiceId[id], 0)
  return acc
},  {})

let days = {} as {[key: number]: CellT}
const numDays = new Date(Date.UTC(year, month+1, 0)).getDate()

for(let i = 1; i <= numDays; i++) {
  let className = 'day no'
  const cYear = new Date().getFullYear()
  const cMonth = new Date().getMonth()
  const cDay = new Date().getDate()
  if (
    year < cYear ||
    year === cYear && month < cMonth ||
    year === cYear && month === cMonth && i < cDay
  ) {
    className = 'day past'
  } else {
    
    if (shedulle[i]?.free) {
      className = 'day free'
    }

    const hours = (durationByDay[i] || 0) / 60
    if (hours > 0) className = 'day easy'
    if (hours >= 5) className = 'day medium'
    if (hours >= 10) className = 'day hard'
  }

  days[i] = { active: true, class: className }
}
return days
}

</script>

<Calendar
  on:click={({ detail }) => dispatch('click', detail)}
  on:next={() => dispatch('next')}
  on:prev={() => dispatch('prev')}
  year={year}
  month={month}
  days={getDays(orders, services, shedulle)}
>
  <style>
    .day {
      background-color: transparent;
      color: black;
      border-radius: 0;
      width: 100%;
      height: 100%;
    }
    .past {
      background-color: white;
      color: grey;
      text-decoration: line-through; 
    }
    .free {
      background-color: white;
      color: grey
    }
    .no {
      background-color: lightgray;
    }
    .easy {
      background-color: lightgreen;
    }
    .medium {
      background-color: lightyellow;
    }
    .hard {
      background-color: lightcoral;
    }
  </style>
</Calendar>
<div class='legend'>
  <span class="day past">i</span> прошедший день
  <span class="day free">i</span> выходной
  <span class="day no">i</span> нет записи
  <span class="day easy">i</span> 0-5ч работы
  <span class="day medium">i</span> 5-10ч работы
  <span class="day hard">i</span> 10+ч работы
</div>

<style>
  .legend {
    box-sizing: border-box;
    display: grid;
    align-self: flex-start;
    grid-template-columns: auto auto;
    row-gap: 4px;
    margin-left: 8px;
    margin-bottom: 12px;
  }
  .day {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border: 1px solid black;
  }
</style>
