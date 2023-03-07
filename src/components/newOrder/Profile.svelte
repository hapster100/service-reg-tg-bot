<script lang="ts">
  import { getUser, updateUser } from "../../api/users";
  import { OrderStep, type OrderStore } from "../../stores/newOrder";
  import Loader from "../Loader.svelte";
  import UserForm from "../UserForm.svelte";

  export let store: OrderStore
  const { userId, currentStep }  = store
  
  let userPromise = getUser(userId)

  async function handleUser({detail}) {
    const user = await userPromise
    userPromise = new Promise(async (res) => {
      try {
        await updateUser(detail)
        await store.makeOrder()
        $currentStep = OrderStep.Success
      } finally {
        res(user)
      }
    })
  }

</script>

<h3 class="page-title">
  Профиль
</h3>
<div class="profile fullw">
  {#await userPromise}
    <Loader />
  {:then user}
    <UserForm
      name={user?.name || ''}
      phone={user?.phone?.digits}
      on:submit={handleUser}
    />
  {/await}
</div>

<style>
  .profile {
    margin-bottom: 12px;
  }
</style>
