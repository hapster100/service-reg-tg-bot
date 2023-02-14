<script lang="ts">
  import type { Service } from '../models/Service';
  import ServiceInfo from './ServiceInfo.svelte';

  export let service: Service
</script>

<div class="service fullw">
  <ServiceInfo service={service} />
  <img class="service-image fullw" src={service.imageUrl} alt={service.name}>
</div>

<style>
  .service-image {
    aspect-ratio: 1.2;
    object-fit: cover;
  }
  .service {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    box-sizing: border-box;
  }

</style>
