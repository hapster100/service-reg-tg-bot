export class User {
  readonly id: string 
  readonly username: string
  
  constructor({ id, username }) {
    this.id = id
    this.username = username
  }
}
