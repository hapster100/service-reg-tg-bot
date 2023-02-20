export class Phone {
  readonly digits: string
  
  constructor(raw: string) {
    this.digits = raw.replace(/\D/g, '').padEnd(10, 'X')
  }

  get parts() {
    return [
      this.digits.slice(0, 3),
      this.digits.slice(3, 6),
      this.digits.slice(6, 8),
      this.digits.slice(8)
    ]
  }

  toString() {
    const parts = this.parts
    return `+7 (${parts[0]}) ${parts[1]}-${parts[2]}-${parts[3]}`
  }
}

export class User {
  readonly id: string 
  readonly username?: string
  readonly phone?: Phone
  readonly name?: string
  readonly isAdmin?: boolean
  
  constructor(raw: {
    id: string
    username?: string,
    phone?: Phone,
    name?: string,
    isAdmin?: boolean,
  }) {
    const {id, username, phone, name, isAdmin} = raw
    this.id = id
    if (username) this.username = username
    if (phone) this.phone = phone
    if (name) this.name = name
    if (isAdmin) this.isAdmin = isAdmin
  }
}
