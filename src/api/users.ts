import { User, ClientListUser } from "../models/User";
import { baseApiFetch } from "./base";

const toUser = (raw): User|null => raw
  ? new User(raw)
  : null

const toClientListUser = (raw): ClientListUser|null => raw
  ? new ClientListUser(raw)
  : null

export async function getUser(id: string) {
  const res = await baseApiFetch('/users/' + id)
  const { user } = await res.json()
  return toUser(user)
}

export async function getUsers(ids: string[]): Promise<User[]> {
  const res = await baseApiFetch('/users/byIds', 'POST', { ids })
  const json = await res.json()
  const { users } = json
  return (users || []).map(toUser).filter((maybeUser: User|null) => maybeUser !== null)
}

export async function getClients(): Promise<ClientListUser[]> {
  const res = await baseApiFetch('/users/clients')
  const json = await res.json()
  const { users } = json
  return (users || []).map(toClientListUser).filter((maybeUser: ClientListUser|null) => maybeUser !== null)
}

export async function updateUser(user: User) {
  const body = {
    user: {
      ...user,
      phone: user.phone?.digits || undefined
    }
  }

  return await baseApiFetch('/users', 'POST', body)
}
