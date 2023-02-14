export class Category {
  readonly id: string 
  readonly name: string
  readonly priority: number

  constructor({
    id,
    name,
    priority = 0,
  }) {
    this.id = id
    this.name = name
    this.priority = priority 
  }
}
 