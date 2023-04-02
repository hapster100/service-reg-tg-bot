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
    id: string,
    username?: string,
    phone?: string,
    name?: string,
    isAdmin?: boolean,
  }) {
    const {id, username, phone, name, isAdmin} = raw
    this.id = id
    if (username) this.username = username
    if (phone) this.phone = new Phone(phone)
    if (name) this.name = name
    if (isAdmin) this.isAdmin = isAdmin
  }
}

export class ClientListUser extends User {
  readonly lastOrder?: Date
  readonly ordersCount?: number

  constructor(raw: {
    id: string,
    username?: string,
    phone?: string,
    name?: string,
    isAdmin?: boolean,
    lastOrder?: string,
    ordersCount?: number,
  }) {
    console.log(raw)
    super(raw)
    if (raw.lastOrder) this.lastOrder = new Date(raw.lastOrder) 
    if (raw.ordersCount) this.ordersCount = Number(raw.ordersCount)
  }
}
