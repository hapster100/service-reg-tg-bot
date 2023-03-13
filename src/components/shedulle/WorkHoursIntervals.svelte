<script lang="ts">
  import { Time } from "../../models/Time";
  import Icon from "../Icon.svelte";
  import TimeIntervalInput from "../TimeIntervalInput.svelte";
  interface Interval<T = number> {
    start: T
    end: T
  }

  export let free: boolean
  export let intervals = [] as Interval[]
  export let times = [] as Interval<Time>[]
  
  let workStart = 6*60
  let workEnd = 21*60

  $: {
    let workIntervals = [] as Interval[]
    workIntervals.push({ start: workStart, end: workEnd })
    for(const interval of intervals) {
      if (interval.end - interval.start > 0) {
        workIntervals = workIntervals.flatMap(curr => {
          if (curr.start < interval.start && curr.end > interval.end) {
            return [{
              ...curr,
              end: interval.start
            },{
              ...curr,
              start: interval.end
            }]
          }
          if (curr.start >= interval.start && curr.end <= interval.end) {
            return []
          }
          if (interval.end < curr.end && interval.end > curr.start) {
            return [{
              ...curr,
              start: interval.end
            }]
          }
          if (interval.start < curr.end && interval.start > curr.start) {
            return [{
              ...curr,
              end: interval.start
            }]
          }
          return [curr]
        })
      }
    }
    times = workIntervals.map(({start,end}) => ({
      start: Time.fromMinutes(start),
      end: Time.fromMinutes(end)
    }))
  }

  $: {
    const minmax = (x: number) => Math.max(workStart, Math.min(workEnd, x))
    for(let interval of intervals) {
      interval.start = minmax(interval.start)
      interval.end = minmax(interval.end)
    }
    intervals = intervals.filter(x => x.start !== x.end)
  }

  function addInterval() {
    intervals = [...intervals, {start: workStart, end: workEnd}]
  }
  function deleteInterval(interval) {
    intervals = intervals.filter(x => x !== interval)
  }

</script>

<div class="free-field">
  <span>Выходной:</span>
  <input bind:checked={free} name="free" type="checkbox"/>
</div>
{#if !free}
  <div class="day-setting fullw">
    <div class="times">
      <div class="section-title">Расписание</div>
      <div class="mb-12">
        <ul>
          {#each times as time}
            <li>
              {time.start} - {time.end}
            </li>
          {/each}
        </ul>
      </div>
    </div>
    <div class="work-hours">
      <div class="section-title">
        Рабочие часы
      </div>
      <div class="interval mb-20">
        <TimeIntervalInput
          bind:start={workStart}
          bind:end={workEnd}
        />
      </div>
    </div>
    <div class="frees">
      <div class="section-title">
        Перерывы
      </div>
      <div class="mb-20">
        {#if intervals.length}
          {#each intervals as interval}
            <div class="interval">
              <TimeIntervalInput
                min={workStart}
                max={workEnd}
                start={interval.start}
                end={interval.end}
                on:change={({detail: {start, end}}) => {
                  interval.start = start
                  interval.end = end
                }}
              />
              <button class="delete-btn" on:click={() => deleteInterval(interval)}>
                <Icon icon="delete" />
              </button>
            </div>
          {/each}
        {:else}
          <div>
            Без перерывов
          </div>
        {/if}
      </div>
    </div>
  </div>
  <button class="fullw mb-12" on:click={addInterval}>Добавить перерыв</button>
{/if}

<style>

  .day-setting {
    display: grid;
    column-gap: 12px;
    grid-template-columns: 3fr 4fr;
    grid-template-rows: 120px auto;
    grid-template-areas:
      "hours-area frees-area"
      "times-area frees-area";
  }

  .work-hours {
    grid-area: hours-area;
  }

  .frees {
    grid-area: frees-area;
  }

  .times {
    grid-area: times-area;
  }

  .section-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .delete-btn {
    margin-left: 12px;
  }

  .interval {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .interval:last-child {
    margin-bottom: 0;
  }

  .free-field {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
  }

  .free-field span {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 20px;
    font-weight: bold;
    margin-right: 12px;
  }

  .free-field input {
    display: block;
    height: 20px;
    width: 20px;
    border: 1px solid var(--color-text);
    outline: none;
    background-color: var(--color-text);
    accent-color: var(--color-text);
  }
</style>