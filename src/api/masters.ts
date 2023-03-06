import { baseApiFetch } from "./base";

export async function getAddress() : Promise<String> {
  const res = await baseApiFetch('/masters/address')
  const json = await res.json()
  return json.address as String
}
