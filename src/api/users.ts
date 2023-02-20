import { Phone, User } from "../models/User";
import { baseApiFetch } from "./base";

const toUser = (raw): User|null => raw ? new User({
  ...raw,
  phone: raw?.phone ? new Phone(raw.phone) : undefined
}) : null

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

export async function updateUser(user: User) {
  const body = {
    user: {
      ...user,
      phone: user.phone?.digits || undefined
    }
  }

  return await baseApiFetch('/users', 'POST', body)
}
