export class Service {
  readonly id: string
  readonly name: string
  readonly durationMinutes: number
  readonly imageUrl: string
  readonly cost: number
  readonly categoryId: string
  readonly deleted: boolean

  constructor({
    id, 
    name,
    durationMinutes,
    categoryId,
    imageUrl,
    cost,
    deleted
  }) {
    this.categoryId = categoryId,
    this.id = id
    this.name = name
    this.durationMinutes = durationMinutes
    this.imageUrl = imageUrl
    this.cost = cost
    this.deleted = deleted
  }
}
