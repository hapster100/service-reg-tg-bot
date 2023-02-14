<script context="module" lang="ts">
  export type CellT = { class: string, active: boolean }
  export interface WithDay extends CellT { day: number }

</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";



  export let year: number
  export let month: number
  export let days: { [key: number]: CellT }
  
  const dispatch = createEventDispatcher<{
    'click': WithDay,
    'prev': undefined,
    'next': undefined
  }>()

  let table = [] as (WithDay|null)[][]
  
  $: {
    const numDays = new Date(Date.UTC(year, month+1, 0)).getDate()
    const dayOfWeek = (new Date(Date.UTC(year, month, 1)).getDay() + 6)%7
    const numOfRows = Math.ceil((numDays + dayOfWeek) / 7)
    
    table = []

    for(let row = 0; row < numOfRows; row++) {
      table[row] = []
      for(let col = 0; col < 7; col++) {
        const day = row * 7 + col - dayOfWeek + 1
        if (day <= 0 || day > numDays) {
          table[row][col] = null
          continue
        }
        table[row][col] = {
          active: days[day]?.active || false,
          class: days[day]?.class || '',
          day
        }
      }
    }
  }

  function click(cell: WithDay|null) {
    return function() {
      if (cell !== null) {
        dispatch('click', cell)
      }
    }
  }

</script>

<div class='calendar fullw'>
  <div class='calendar-head'>
    <button on:click={() => dispatch('prev')} class='calendar-head-cell'>{'<'}</button>
    <span class='calendar-head-cell'>{year} {month}</span>
    <button on:click={() => dispatch('next')} class='calendar-head-cell'>{'>'}</button>
  </div>
  <div class='calendar-row some'>
    {#each ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'] as day}
      <div class="calendar-cell">{day}</div>
    {/each}
  </div>
  {#each table as row}
    <div class='calendar-row'>
      {#each row as cell}
        <div class='calendar-cell'>
          {#if cell}
            {#if cell.active}
              <button on:click={click(cell)} class={cell.class}>{cell.day}</button>
            {:else}
              <span class={cell.class}>{cell.day}</span>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<slot></slot>

<style>
  .calendar {
    border: 1px solid black;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .calendar-head {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid black;
  }

  .calendar-head-cell {
    display: flex;
    flex: 1;
    border-radius: 0;
    align-items: center;
    justify-content: center;
  }

  .calendar-row {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid black;
  }

  .calendar-row:last-child {
    border-bottom: 0;
  }

  .calendar-cell {
    flex: 1;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid black;
  }

  .calendar-cell:last-child {
    border-right: 0;
  }

</style>
