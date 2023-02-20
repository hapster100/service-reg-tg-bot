import { writable, type Writable } from "svelte/store";
import { createOrder } from "../api/orders";
import { Time } from "../models/Time";
import { userId } from "./user";

export enum OrderStep {
  Services,
  Date,
  Time,
  Success,
}

export const serviceIds = writable([] as string[])
export const year = writable(new Date().getFullYear())
export const month = writable(new Date().getMonth())
export const day = writable(1)
export const time: Writable<Time> = writable(new Time(0, 0))

export const current = writable(OrderStep.Services)
export const daySlots = writable([] as Time[])

export function reset() {
  serviceIds.set([])
  year.set(new Date().getFullYear())
  month.set(new Date().getMonth())
  time.set(new Time(0, 0))
  day.set(1)
  daySlots.set([])
  current.set(OrderStep.Services)
}


const orderForm = {
  serviceIds: [] as string[],
  year: 0,
  month: 0,
  day: 0,
  time: new Time(0, 0),
  userId 
}

serviceIds.subscribe(v => orderForm.serviceIds = [...v])
year.subscribe(v => orderForm.year = v)
month.subscribe(v => orderForm.month = v)
day.subscribe(v => orderForm.day = v)
time.subscribe(v => orderForm.time = v || new Time(0, 0))


export async function makeOrder() {
  return await createOrder(orderForm)
}
