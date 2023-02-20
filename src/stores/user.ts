import { writable } from "svelte/store"

export const userId = Telegram.WebApp.initDataUnsafe.user?.id?.toString() || 'test_id'
export const initFullName = [
  Telegram.WebApp.initDataUnsafe?.user?.first_name || '',
  Telegram.WebApp.initDataUnsafe?.user?.last_name || '',
].join(' ').trim()

export const isAdmin = writable(false)
