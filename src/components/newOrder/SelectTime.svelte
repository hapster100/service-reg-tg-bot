<script lang="ts">
  import type { Time } from '../../models/Time';
  import { 
    current, OrderStep, daySlots,
    makeOrder, time, 
  } from '../../stores/newOrder'
  import { goTo } from '../../stores/routes';

  function handle(time: Time) {
    $time = time
    makeOrder()
    goTo.MyOrders()
  }
</script>

<h3 class="page-title">Выбор времени</h3>
<div class="select-time">
  {#each $daySlots as slot}
    <button class="outline-btn time-slot" on:click={() => handle(slot)}>
      {slot}
    </button>
  {/each}
</div>
<button class="fullw" on:click={() => $current = OrderStep.Date}>Назад</button>

<style>
  .select-time {
    display: grid;
    grid-template-columns: repeat(4, calc((100% - 24px)/4));
    margin-bottom: 20px;
    gap: 8px;
  }
</style>
