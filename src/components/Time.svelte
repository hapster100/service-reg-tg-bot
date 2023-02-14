<script lang="ts">
  import { Time } from "../models/Time";


  export let duration: number
  let time = Time.fromMinutes(duration)
  let hp = (h: number) => h===1 ? 'час' 
  : h<5 ?'часа'
  :'часов'

  $: time = Time.fromMinutes(duration)

</script>

<sapn class="service-time">
  🕓
  {#if (time.hours > 0)}
    {time.hours} {hp(time.hours)}
  {/if}
  {#if (time.minutes > 0)}
    {time.minutes} минут
  {/if}
</sapn>

<style>
  .service-time {
    display: inline-block;
    margin-left: 8px;
  }
</style>
