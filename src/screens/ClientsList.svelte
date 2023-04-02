<script lang="ts">
  import { getClients } from "../api/users";
  import BackToMenu from "../components/BackToMenu.svelte";
  import ClientListUserInfo from "../components/ClientListUserInfo.svelte";
  import Loader from "../components/Loader.svelte";
  import { goToWithState } from "../stores/routes";
  const clientsPromise = getClients()
</script>

<div class="clients-list fullw">
  {#await clientsPromise}
    <Loader />
  {:then clients} 
    {#each clients as client}
    <div class="info mb-20">
      <ClientListUserInfo user={client} />
      <button class="fullw"
        on:click={goToWithState.MyOrders({userId: client.id, showAll: true})}
      >История</button>
    </div>
    {/each}
  {/await}
</div>

<BackToMenu />

<style>
  .clients-list {
    min-height: 33vh;
  }
  
  .info {
    border: 1px solid var(--color-text);
    overflow: hidden;
    border-radius: 8px;
  }

  .info button {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

</style>
