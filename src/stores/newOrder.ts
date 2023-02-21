import { writable, type Unsubscriber, type Writable } from "svelte/store";
import { createOrder, type OrderForm } from "../api/orders";
import { Time } from "../models/Time";
import { userId } from "./user";

export enum OrderStep {
  Services,
  Date,
  Time,
  Success,
}

type TimeMap = {
  [key: number]: Time[]
}

type SlotsCache = {
  [key: number]: {
    [key: number]: TimeMap | null | undefined
  } | null | undefined
}
export class OrderStore {
  readonly serviceIds: Writable<string[]>
  readonly year: Writable<number>
  readonly month: Writable<number>
  readonly day: Writable<number>
  readonly time: Writable<Time>
  readonly currentStep: Writable<OrderStep>
  readonly daySlots: Writable<Time[]>
  readonly slotsCache: Writable<SlotsCache>
  
  private form: OrderForm
  private unsubs: Unsubscriber[]

  constructor() {
    this.serviceIds = writable([])
    this.year = writable(new Date().getFullYear())
    this.month = writable(new Date().getMonth())
    this.day = writable(1)
    this.time = writable(new Time(0, 0))
    this.currentStep = writable(OrderStep.Services)
    this.daySlots = writable([])
    this.slotsCache = writable({})
    this.form = {
      serviceIds: [] as string[],
      year: 0,
      month: 0,
      day: 0,
      time: new Time(0, 0),
      userId
    }
    this.unsubs = []
  }
  
  init() {
    this.unsubs = this.unsubs.concat([
      this.serviceIds.subscribe(() => this.slotsCache.update(() => ({}))),
      this.serviceIds.subscribe(v => this.form.serviceIds = [...v]),
      this.year.subscribe(v => this.form.year = v),
      this.month.subscribe(v => this.form.month = v),
      this.day.subscribe(v => this.form.day = v),
      this.time.subscribe(v => this.form.time = v || new Time(0, 0)),
    ])
  }

  reset() {
    this.serviceIds.set([])
    this.year.set(new Date().getFullYear())
    this.month.set(new Date().getMonth())
    this.time.set(new Time(0, 0))
    this.day.set(1)
    this.daySlots.set([])
    this.currentStep.set(OrderStep.Services)
    this.slotsCache.set({})
  }

  async makeOrder() {
    return await createOrder(this.form) 
  }

  destroy() {
    while(this.unsubs.length) {
      const unsub = this.unsubs.pop()
      unsub?.()
    }
  }
}
