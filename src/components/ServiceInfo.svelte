<script lang='ts'>
  import type { Service } from "../models/Service";
  import ServiceTime from './Time.svelte';

  export let service : Service
</script>

<div class="service-info fullw">
  <p class="service-name">
    {service.name}
  </p>
  <p class="service-cost">
    {service.cost}p. <ServiceTime duration={service.durationMinutes} />
  </p>
</div>

<style>
  .service-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 8px;
    min-height: 60px;
  }

  .service-name {
    margin: 0;
    margin-bottom: 4px;
    font-weight: bold;
    font-size: 1rem;
  }

  .service-cost {
    margin: 0;
    font-size: 0.8rem;
  }
</style>