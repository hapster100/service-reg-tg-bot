<script lang="ts">
  import type { ClientListUser } from "../models/User";
  import UserInfo, {classes} from './UserInfo.svelte';
  export let user: ClientListUser
</script>

<UserInfo {user}>
  <div class={classes.prop}>
    Последний визит:
  </div>
  <div class={classes.value}>
    {user.lastOrder?.toLocaleDateString?.('ru', {
      month: 'long',
      day: 'numeric',
    }) || '---'}
  </div>
  <div class={classes.prop}>
    Всего визитов:
  </div>
  <div class={classes.value}>
    {user.ordersCount || 0}
  </div>
</UserInfo>

