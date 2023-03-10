import type { Time } from "./Time"

export class Order {
  readonly id: string
  readonly serviceIds: string[]
  readonly userId: string
  readonly date: Date
  readonly time: Time
  readonly deleted: Boolean

  constructor({
    id, serviceIds,
    userId, date,
    time, deleted
  }) {
    this.id = id
    this.serviceIds = serviceIds
    this.userId = userId
    this.time = time
    this.date = date
    this.deleted = deleted || false
  }
}
