export class Category {
  readonly id: string 
  readonly name: string
  readonly priority: number
  readonly deleted: boolean

  constructor({
    id,
    name,
    priority = 0,
    deleted = false,
  }) {
    this.id = id
    this.name = name
    this.priority = priority
    this.deleted = deleted
  }
}
 