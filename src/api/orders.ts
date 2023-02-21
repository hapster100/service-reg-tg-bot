import { Order } from "../models/Order"
import { Time } from "../models/Time"
import { userId } from "../stores/user"
import { baseApiFetch, type NoId } from "./base"

function toOrder(raw: any) {
  return new Order({
    ...raw,
    date: new Date(raw.date),
    time: new Time(raw.time.hours, raw.time.minutes)
  })
}

function byDate(ord1: Order, ord2: Order) {
  return ord1.date.getFullYear() -  ord2.date.getFullYear()
  || ord1.date.getMonth() - ord2.date.getMonth()
  || ord1.date.getDate() - ord2.date.getDate()
  || ord1.time.toMinutes() - ord2.time.toMinutes()
}

export interface OrderForm {
  year: number,
  month: number,
  day: number,
  time: Time,
  userId: string,
  serviceIds: string[]
}

export async function createOrder(order: OrderForm) {
  return await baseApiFetch('/orders', 'POST', { order })
}

export async function updateOrder(order: Order) {
  return await baseApiFetch('/orders/' + order.id, 'PUT', { order })
}

export async function getOrders(year: number, month: number, day?: number) {
  const res = await baseApiFetch('/orders/get', 'POST', {
    year, month, day
  })
  const json = await res.json()
  const orders: Order[] = json?.orders.map(toOrder) || []
  orders.sort(byDate)
  return orders
}

export async function myOrders() {
  const res = await baseApiFetch('/orders/user/' + userId)
  const json = await res.json()
  const orders: Order[] = json?.orders.map(toOrder) || []
  orders.sort(byDate)
  return orders
}

export async function cancelOrder(orderId: string) {
  return await baseApiFetch('/orders/' + orderId, 'DELETE');
}

export async function getSlots(
  year: number,
  month: number,
  duration: number,
  editOrderId?: string
) : Promise<{[key: string]: Time[]}> {

  const body = { year, month, duration } as any
  if (editOrderId) {
    body.orderId = editOrderId
  }
  
  const slots = await baseApiFetch('/orders/slots', 'POST', body)
    .then(res => res.json())
  
  return Object.keys(slots).reduce((acc, day) => {
    acc[day] = slots[day].map(Time.fromMinutes)
    return acc
  }, {})
}
