<script lang='ts'>
  import { createEventDispatcher } from "svelte";
  import { Phone, User } from "../models/User";
  import { initFullName, userId } from "../stores/user";
  import PhoneInput from "./PhoneInput.svelte";
  
  export let name = initFullName
  export let phone = ''

  const dispatch = createEventDispatcher<{
    'submit': User
  }>()

  let valid = false

  $: valid = name.trim().length > 0 && phone.replace(/\D/g, '').length === 11

  function submit(e: Event) {
    e.preventDefault()
    const user = new User({
      id: userId,
      phone: phone.replace(/\D/g, '').slice(1),
      name: name.trim()
    })
    dispatch('submit', user)
  }

</script>


<form class="form fullw" on:submit={submit}>
  <div class="form-field">
    <label for="name">Имя</label>
    <input maxlength="100" type="text" id="name" bind:value={name} />
  </div>
  <div class="form-field">
    <label for="phone">Номер телефона</label>
    <PhoneInput bind:phone={phone} />
  </div>
  <button disabled={!valid} class:disabled-btn={!valid} type="submit">Сохранить</button>
</form>

