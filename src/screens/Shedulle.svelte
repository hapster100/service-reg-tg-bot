<script lang="ts">
  import { writable } from "svelte/store";
  import { getOrders } from "../api/orders";
  import { getAllServices } from "../api/services";
  import { getShedulle, updateShedulle } from "../api/shedulle";
  import BackToMenu from "../components/BackToMenu.svelte";
  import Calendar, { type WithDay } from "../components/Calendar.svelte";
  import IntervalInput from "../components/IntervalInput.svelte";
  import OrderInfo from "../components/OrderInfo.svelte";
  import OrdersShedulle from "../components/shedulle/OrdersShedulle.svelte";
  import type { Order } from "../models/Order";
  import type { Service } from "../models/Service";
  import { Interval, Shedulle } from "../models/Shedulle";
  import {Time} from "../models/Time";
  
  const year = writable(new Date().getFullYear())
  const month = writable(new Date().getMonth())
  const day = writable(0)

  const services = writable([] as Service[])
  const orders = writable([] as Order[])
  const shedulle = writable({} as Shedulle)

  const selected = writable(new Set() as Set<number>)
  const free = writable(true)

  let dayStart = 0;
  let breakStart = 0.4
  let breakEnd = 0.6
  let dayEnd = 1;

  function fromNormalized(n: number) {
    const min = 7 * 60
    const max = 23 * 60
    const step = 60
    const minutes = (max - min) * n + min
    const steps = Math.round(minutes/step)
    return Time.fromMinutes(steps * step)
  }

  $: getAllServices().then(res => $services = res)
  $: {
    $orders = []
    $shedulle = {}
    $selected = new Set()
    Promise.all([
      getOrders($year, $month),
      getShedulle($year, $month)
    ]).then(([orders, shedulle]) => {
      $orders = orders
      $shedulle = shedulle
    })
  }

  enum ShedulleMode {
    Orders,
    WorkHours
  }

  const mode = writable(ShedulleMode.Orders)


  function setMode(mode: ShedulleMode) {
    return function() {
      $mode = mode
    }
  }

  function nextMonth() {
    if ($month === 11) {
      $month = 0
      $year = $year + 1
    } else {
      $month = $month + 1
    }
  }

  function prevMonth() {
    if ($month === 0) {
      $month = 11
      $year = $year - 1
    } else {
      $month = $month - 1
    }
  }

  let dayString = ''
  $: dayString = new Date($year, $month, $day).toLocaleDateString('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  
  function getSelectedDays(shedulle: Shedulle, selected: Set<number>) {
    const days = {}
    for(let key in shedulle) {
      const classes = ['day']
      classes.push(selected.has(+key) ? 'selected' : 'unselected')
      classes.push(shedulle[+key].free ? 'free' : 'not-free')
      days[+key] = {
        active: true,
        class: classes.join(' ')
      }
    }
    return days
  }

  function toggleSelect({detail}: {detail: WithDay}) {
    selected.update(set => {
      if (set.has(detail.day)) {
        set.delete(detail.day)
      } else {
        set.add(detail.day)
      }
      return set
    })
  }

  async function edit() {
    const intervals = [] as Interval[]
    if (fromNormalized(breakStart).toMinutes() === fromNormalized(breakEnd).toMinutes()) {
      intervals.push(new Interval({
        from: fromNormalized(dayStart).toMinutes(),
        to: fromNormalized(dayEnd).toMinutes(),
      }))
    } else {
      intervals.push(new Interval({
        from: fromNormalized(dayStart).toMinutes(),
        to: fromNormalized(breakStart).toMinutes()
      }))
      intervals.push(new Interval({
        from: fromNormalized(breakEnd).toMinutes(),
        to: fromNormalized(dayEnd).toMinutes()
      }))
    }

    const shedulleUpdate = new Shedulle(
      [...$selected].reduce((acc, day) => (acc[day] = {
        free: $free,
        intervals
      }, acc), {})
    )
    await updateShedulle($year, $month, shedulleUpdate)
    $selected = new Set()
    const newShedule = await getShedulle($year, $month)
    $shedulle = newShedule
  }

</script>
{#if $day > 0}
<h3 class="page-title">{dayString}</h3>
<ul class="fullw">
  {#each $shedulle[$day]?.intervals as {from, to}}
  <li>
    {Time.fromMinutes(from).toString().padStart(5, '')} - {Time.fromMinutes(to).toString().padStart(5)}
  </li>  
  {/each}
</ul>
{#each $orders.filter(({ date }) => date.getDate() === $day) as order}
  <div class="order fullw">
    <OrderInfo order={order} services={$services} />
    <div class="user">
      {order.userId}
    </div>
  </div>
{/each}
<button class="back-btn fullw" on:click={() => $day = 0}>К датам</button>
{:else}
  <h3 class="page-title">Расписание</h3>
  <div class="mode-ctrl fullw">
    <button
      class={$mode === ShedulleMode.Orders ? '' : 'not-active'} 
      on:click={setMode(ShedulleMode.Orders)}
    >Просмотр записей</button>
    <button
      class={$mode === ShedulleMode.WorkHours ? '' : 'not-active'}
      on:click={setMode(ShedulleMode.WorkHours)}
    >Рабочие часы</button>
  </div>
  {#if $mode === ShedulleMode.Orders}
    <OrdersShedulle
      on:click={({detail}) => $day = detail.day}
      on:next={nextMonth}
      on:prev={prevMonth}
      year={$year}
      month={$month}
      services={$services}
      orders={$orders}
      shedulle={$shedulle}
    />
  {:else}
    <Calendar
      on:click={toggleSelect}
      on:next={nextMonth}
      on:prev={prevMonth}
      year={$year}
      month={$month}
      days={getSelectedDays($shedulle, $selected)}
    >
    <style>
      .day {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
      .selected {
        background-color: black;
      }

      
      .unselected {
        background-color: white;
        color: black;
      }

      .selected.free {
        background-color: grey;
        color: white;
      }

      .free {
        color: grey;
      }
    </style>
    </Calendar>
    <div class="free-field">
      <label for="free">Выходной:</label>
      <input bind:checked={$free} name="free" type="checkbox"/>
    </div>
    <div class="interval-input fullw">
      <IntervalInput 
        bind:dayStart bind:dayEnd
        bind:breakStart bind:breakEnd
      />
    </div>
    <div class="interval fullw">
      Рабочие часы: {fromNormalized(dayStart)} - {fromNormalized(dayEnd)}
    </div>
    {#if fromNormalized(breakStart).toMinutes() !== fromNormalized(breakEnd).toMinutes()}
      <div class="interval fullw">
        Перерыв: {fromNormalized(breakStart)} - {fromNormalized(breakEnd)}
      </div>
    {/if}
    <button class="fullw edit-btn" on:click={edit}>Изменить</button>
  {/if}
{/if}

<BackToMenu />


<style>

  .edit-btn {
    margin-bottom: 12px;
  }

  .mode-ctrl {
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  
  .interval-input {
    margin: 20px;
  }

  .interval {
    margin-bottom: 12px;
  }

  .mode-ctrl button {
    flex: 1;
    border: 1px solid black;
  }

  .mode-ctrl .not-active {
    background-color: white;
    color: black;
  }

  .mode-ctrl button:last-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;

  }

  .mode-ctrl button:first-child {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .user {
    margin: 8px;
  }

  .back-btn {
    margin-bottom: 12px;
  }

  .order {
    border-radius: 8px;
    border: 1px solid black;
    margin-bottom: 12px;
    overflow: hidden;
  }

  h3 {
    margin: 8px;
  }

  .free-field {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .free-field label {
    display: block;
    height: 100%;
  }

  .free-field input {
    display: block;
    height: 20px;
    width: 20px;
    border: 1px solid black;
    outline: none;
    background-color: black;
    accent-color: black;
  }

</style>
