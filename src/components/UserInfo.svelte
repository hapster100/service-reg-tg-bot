<script context="module" land="ts">
  export const classes = {
    prop: 'user-prop',
    value: 'user-val'
  }
</script>
<script lang="ts">
  import type { User } from "../models/User";
  export let user: User
</script>

<div class="user">
  <div class={classes.prop}>Имя:</div>
  <div class={classes.value}>{user?.name || '---'}</div>
  <div class={classes.prop}>Телефон:</div>
  <div class={classes.value}>
    {#if user?.phone}
      <a class="phone-link" href="tel:{user?.phone}">
        {user?.phone}
      </a>
    {:else}
      ---          
    {/if}
  </div>
  <slot></slot>
</div>

<style>
  .user {
    padding: 8px 0;
    margin: 8px;
    display: grid;
    grid-template-columns: max-content auto;
    column-gap: 12px;
    row-gap: 8px;
    align-items: center;
    justify-content: flex-start;
  }
  
  .user :global(.user-prop) {
    display: block;
    font-weight: 800;
  }

  .user :global(.user-val) {
    display: block;
  }
</style>
