<script lang="ts">
  import { writable } from "svelte/store";
  import { getOrders } from "../api/orders";
  import { getAllServices } from "../api/services";
  import { getShedulle, updateShedulle } from "../api/shedulle";
  import BackToMenu from "../components/BackToMenu.svelte";
  import OrdersShedulle from "../components/shedulle/OrdersShedulle.svelte";
  import ShedulleOrders from "../components/shedulle/ShedulleOrders.svelte";
  import WorkHoursCalendar from "../components/shedulle/WorkHoursCalendar.svelte";
  import WorkHoursIntervals from "../components/shedulle/WorkHoursIntervals.svelte";
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
  const times = writable([] as {start: Time, end: Time}[])

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

  async function edit() {
    const intervals = [] as Interval[]
    for(const interval of $times) {
      intervals.push(new Interval({
        from: interval.start.toMinutes(),
        to: interval.end.toMinutes(),
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
  <ShedulleOrders orders={$orders.filter(({ date }) => date.getDate() === $day)} services={$services}/>
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
    <WorkHoursCalendar
      on:next={nextMonth}
      on:prev={prevMonth}
      year={$year}
      month={$month}
      shedulle={$shedulle}
      bind:selected={$selected}
    />
    <WorkHoursIntervals
      bind:free={$free}
      bind:times={$times}
    />
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

  .mode-ctrl button {
    flex: 1;
    border: 1px solid var(--color-text);
  }

  .mode-ctrl .not-active {
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  .mode-ctrl button:last-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;

  }

  .mode-ctrl button:first-child {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  
  .back-btn {
    margin-bottom: 12px;
  }


  h3 {
    margin: 8px;
  }

</style>
