<script lang="ts">
  import { onMount } from "svelte";

  export let phone: string
  let input: HTMLInputElement

  
  onMount(() => {
    if (phone !== mask(phone).masked) {
      const {masked, position} = mask(phone)
      phone = masked
      input?.setSelectionRange(position, position)
      input?.addEventListener('focus', e => e.preventDefault())
    }
  })

  function mask(value: string) {
    const digits = value.replace(/^\+7/, '').replace(/\D/g, '')
    let masked = '+7 (XXX) XXX-XX-XX'
    for(let n of digits) {
      masked = masked.replace('X', n)
    }
    return {
      masked: masked.replaceAll('X', '_'),
      position: masked.match(/\D+$/)?.index || masked.length,
    }
  }

  function handler() {
    if (input) {
      const { value } = input
      const { masked, position } = mask(value)
      input.value = masked
      input.setSelectionRange(position, position)
    }
  }
</script>

<input type="tel" on:click={handler} on:focus={handler} on:input={handler} bind:this={input} bind:value={phone} />

