<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let nextDisabled = false
  export let prevDisabled = false
  export let currentText: string

  const dispatch = createEventDispatcher<{
    'next': undefined,
    'prev': undefined
  }>()
</script>

<div class="prev-next-btns fullw">
  <button  class="prev"
    class:disabled-btn={prevDisabled}
    on:click={() => prevDisabled || dispatch('prev')}
  >
    {'<'}
  </button>
  <div class="current">
    {currentText}
  </div>
  <button class="next"
    class:disabled-btn={nextDisabled}
    on:click={() => nextDisabled || dispatch('next')}
  >
    {'>'}
  </button>
</div>


<style>
  .current {
    flex: 2;
    border: 1px solid var(--color-text);
    border-right: 0;
    border-left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .prev, .next {
    flex: 1;
  }

  .prev {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .next {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .prev-next-btns {
    padding: 2px 0;
    display: flex;
    flex-direction: row;
  }
</style>
