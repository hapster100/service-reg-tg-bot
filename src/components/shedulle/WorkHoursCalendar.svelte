<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Shedulle } from "../../models/Shedulle";
  import Calendar, { type WithDay } from "../Calendar.svelte";

  export let year: number
  export let month: number
  export let shedulle: Shedulle
  export let selected: Set<number>
  
  const dispatch = createEventDispatcher<{
    'next': undefined
    'prev': undefined
  }>()

  let days = {}
  $: {
    days = {}
    for(let key in shedulle) {
      const classes = ['day']
      classes.push(selected.has(+key) ? 'selected' : 'unselected')
      classes.push(shedulle[+key].free ? 'free' : 'not-free')
      days[+key] = {
        active: true,
        class: classes.join(' ')
      }
    }
  }
  function toggleSelect({detail}: {detail: WithDay}) {
    const newSelected = selected
    if (selected.has(detail.day)) {
      newSelected.delete(detail.day)
    } else {
      newSelected.add(detail.day)
    }
    selected = newSelected
  }
</script>

<Calendar
  on:click={toggleSelect}
  on:next={() => dispatch('next')}
  on:prev={() => dispatch('prev')}
  year={year}
  month={month}
  days={days}
>
  <style>
    .day {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
    .selected {
      background-color: var(--color-text);
    }

    
    .unselected {
      background-color: var(--color-bg);
      color: var(--color-text);
    }

    .selected.free {
      background-color: grey;
      color: var(--color-bg);
    }

    .free {
      color: grey;
    }
  </style>
</Calendar>