import type { Time } from "./Time"

export class Order {
  readonly id: string
  readonly serviceIds: string[]
  readonly userId: string
  readonly date: Date
  readonly time: Time

  constructor({
    id, serviceIds,
    userId, date,
    time
  }) {
    this.id = id
    this.serviceIds = serviceIds
    this.userId = userId
    this.time = time
    this.date = date
  }
}
