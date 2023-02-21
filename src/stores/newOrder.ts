import { writable, type Unsubscriber, type Writable } from "svelte/store";
import { createOrder, updateOrder, type OrderForm } from "../api/orders";
import { Order } from "../models/Order";
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
  readonly orderId: string
  
  private form: OrderForm
  private initial: OrderForm
  private unsubs: Unsubscriber[]
  private order?: Order

  constructor(order?: Order) {
    this.initial = this.makeInitial(order)
    this.form = this.makeInitial(order)
    this.order = order
    this.unsubs = []

    this.orderId = order?.id ?? ''

    this.serviceIds = writable(this.initial.serviceIds)
    this.year = writable(this.initial.year)
    this.month = writable(this.initial.month)
    this.day = writable(this.initial.day)
    this.time = writable(this.initial.time)

    this.currentStep = writable(OrderStep.Services)
    this.daySlots = writable([])
    this.slotsCache = writable({})
  }

  private makeInitial(order?: Order) : OrderForm {
    const date = order?.date ?? new Date()
    return {
      serviceIds: order?.serviceIds ?? [],
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      time: order?.time ?? Time.fromMinutes(0),
      userId: order?.userId ?? userId,
    } 
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

  async makeOrder() {
    if (!this.order) return await createOrder(this.form) 
    const { userId, time, year, month, day, serviceIds } = this.form
    const date = new Date(Date.UTC(year, month, day))
    const order = new Order({
      id: this.order.id,
      userId, time, date,
      serviceIds,
    })
    return await updateOrder(order)
  }

  destroy() {
    while(this.unsubs.length) {
      const unsub = this.unsubs.pop()
      unsub?.()
    }
  }
}
